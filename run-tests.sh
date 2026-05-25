#!/bin/bash

# ============================================================
#  SCRIPT UNIFIÉ DE TESTS DE L'API SCHOLARLY
#  Couvre l'authentification et les entités principales.
#  Usage : bash run-tests.sh
# ============================================================

set -o pipefail

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

BASE_URL="http://localhost:3000"
ADMIN_EMAIL="superadmin"
ADMIN_PASS="admin123"

PASSED=0
FAILED=0

# Vérifier la présence des commandes
for cmd in curl jq; do
  if ! command -v "$cmd" >/dev/null 2>&1; then
    echo -e "${RED}❌ Commande requise introuvable : $cmd${NC}"
    exit 1
  fi
done

print_section() {
  echo -e "\n${BLUE}================================================${NC}"
  echo -e "${BLUE}  $1${NC}"
  echo -e "${BLUE}================================================${NC}"
}

check_api() {
  if curl -s "$BASE_URL/api/docs" >/dev/null 2>&1; then
    echo -e "${GREEN}✅ API backend accessible sur $BASE_URL${NC}"
    return 0
  else
    echo -e "${RED}❌ L'API n'est pas joignable sur $BASE_URL. Démarrez le serveur avec 'npm run start:dev' d'abord.${NC}"
    exit 1
  fi
}

run_test() {
  local name="$1"
  local method="$2"
  local endpoint="$3"
  local payload="$4"
  local expected="$5"
  local headers="$6"
  local body
  local http_code
  local response

  if [ -z "$headers" ]; then
    headers="-H 'Content-Type: application/json'"
  fi

  if [ "$method" = "POST" ] || [ "$method" = "PATCH" ] || [ "$method" = "PUT" ] || [ "$method" = "DELETE" ]; then
    if [ -n "$payload" ]; then
      response=$(eval "curl -s -w '\n%{http_code}' -X $method '$BASE_URL$endpoint' $headers -d '$payload'")
    else
      response=$(eval "curl -s -w '\n%{http_code}' -X $method '$BASE_URL$endpoint' $headers")
    fi
  else
    response=$(eval "curl -s -w '\n%{http_code}' -X $method '$BASE_URL$endpoint' $headers")
  fi

  http_code=$(echo "$response" | tail -n 1)
  body=$(echo "$response" | sed '$d')

  if [ "$http_code" = "$expected" ]; then
    echo -e "${GREEN}✅ [PASS]${NC} $name ($http_code)" >&2
    PASSED=$((PASSED+1))
    echo "$body"
  else
    echo -e "${RED}❌ [FAIL]${NC} $name (attendu $expected, reçu $http_code)" >&2
    FAILED=$((FAILED+1))
    echo "$body"
    return 1
  fi
}

print_section "VÉRIFICATION DU BACKEND"
check_api

print_section "AUTHENTIFICATION"
auth_resp=$(run_test "Login Admin" "POST" "/auth/login/admin" "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASS\"}" "200" 2>/dev/null || true)
AUTH_TOKEN=$(echo "$auth_resp" | jq -r '.access // empty')

if [ -z "$AUTH_TOKEN" ]; then
  echo -e "${RED}❌ Échec de la récupération du token JWT. Vérifiez vos identifiants administrateur.${NC}"
  exit 1
fi
AUTH_HEADER="-H 'Authorization: Bearer $AUTH_TOKEN' -H 'Content-Type: application/json'"

print_section "TESTS DES ENTITÉS (CRUD BASIQUE)"

# CYCLES
cycle_resp=$(run_test "Créer un cycle" "POST" "/cycles" "{\"libelle\":\"Cycle Test\",\"description\":\"Cycle temporaire\",\"idAdmin\":1}" "201" "$AUTH_HEADER" 2>/dev/null || true)
CYCLE_ID=$(echo "$cycle_resp" | jq -r '.idCycle // empty')
if [ -n "$CYCLE_ID" ] && [ "$CYCLE_ID" != "null" ]; then
  run_test "Lister les cycles" "GET" "/cycles" "" "200" "$AUTH_HEADER" >/dev/null
  run_test "Supprimer le cycle" "DELETE" "/cycles/$CYCLE_ID" "" "200" "$AUTH_HEADER" >/dev/null
fi

# CLASSES
classe_resp=$(run_test "Créer une classe" "POST" "/classes" "{\"libelle\":\"Classe Test\",\"idCycle\":1,\"idAdmin\":1}" "201" "$AUTH_HEADER" 2>/dev/null || true)
CLASSE_ID=$(echo "$classe_resp" | jq -r '.idClasse // empty')
if [ -n "$CLASSE_ID" ] && [ "$CLASSE_ID" != "null" ]; then
  run_test "Lister les classes" "GET" "/classes" "" "200" "$AUTH_HEADER" >/dev/null
  run_test "Supprimer la classe" "DELETE" "/classes/$CLASSE_ID" "" "200" "$AUTH_HEADER" >/dev/null
fi

# COURS
cours_resp=$(run_test "Créer un cours" "POST" "/cours" "{\"libelle\":\"Cours Test\",\"note\":20,\"coefficient\":2,\"description\":\"Test\",\"idLivre\":1,\"actif\":1,\"idAdmin\":1}" "201" "$AUTH_HEADER" 2>/dev/null || true)
COURS_ID=$(echo "$cours_resp" | jq -r '.idCours // empty')
if [ -n "$COURS_ID" ] && [ "$COURS_ID" != "null" ]; then
  run_test "Lister les cours" "GET" "/cours" "" "200" "$AUTH_HEADER" >/dev/null
  run_test "Supprimer le cours" "DELETE" "/cours/$COURS_ID" "" "200" "$AUTH_HEADER" >/dev/null
fi

# ELEVES
eleve_resp=$(run_test "Créer un élève" "POST" "/eleves" "{\"nom\":\"Test\",\"prenom\":\"Eleve\",\"sexe\":1,\"langue\":\"Français\",\"actif\":1,\"idVilleNaissance\":1,\"idAdmin\":1}" "201" "$AUTH_HEADER" 2>/dev/null || true)
ELEVE_MAT=$(echo "$eleve_resp" | jq -r '.matricule // empty')
if [ -n "$ELEVE_MAT" ] && [ "$ELEVE_MAT" != "null" ]; then
  run_test "Lister les élèves" "GET" "/eleves" "" "200" "$AUTH_HEADER" >/dev/null
  run_test "Supprimer l'élève" "DELETE" "/eleves/$ELEVE_MAT" "" "200" "$AUTH_HEADER" >/dev/null
fi

print_section "RÉSUMÉ DES TESTS"
TOTAL=$((PASSED + FAILED))
echo -e "${GREEN}SUCCÈS : $PASSED${NC}"
echo -e "${RED}ÉCHECS : $FAILED${NC}"
echo -e "${YELLOW}TOTAL  : $TOTAL${NC}"

if [ "$FAILED" -eq 0 ]; then
  echo -e "\n${GREEN}🎉 TOUS LES TESTS SONT PASSÉS AVEC SUCCÈS !${NC}"
  exit 0
else
  echo -e "\n${RED}⚠️ CERTAINS TESTS ONT ÉCHOUÉ.${NC}"
  exit 1
fi
