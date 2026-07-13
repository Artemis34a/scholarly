-- Une épreuve ne portait jusqu'ici aucune trace de l'enseignant qui l'a créée :
-- l'appartenance était devinée indirectement à partir d'idClasseCours (optionnel),
-- ce qui rendait une épreuve invisible pour son propre créateur dès que ce champ
-- facultatif n'était pas renseigné. idEnseignant devient la source de vérité
-- explicite pour "qui a créé cette épreuve".

-- 1. Nouvelle colonne.
ALTER TABLE `Epreuve` ADD COLUMN `idEnseignant` INTEGER NULL;

-- 2. Backfill best-effort : pour les épreuves existantes qui précisaient déjà un
-- cours (idClasseCours non nul), on retrouve l'enseignant affecté à ce couple
-- cours/classe. S'il y en a plusieurs, on retient le plus ancien affecté (cas
-- normal : un seul enseignant par couple cours/classe dans les données actuelles).
UPDATE `Epreuve` e
SET e.`idEnseignant` = (
  SELECT a.`idEnseignant`
  FROM `Affectation` a
  WHERE a.`idClasseCours` = e.`idClasseCours`
  ORDER BY a.`id` ASC
  LIMIT 1
)
WHERE e.`idClasseCours` IS NOT NULL;

-- Les épreuves sans idClasseCours (créées côté administrateur, ou héritées du bug
-- diagnostiqué) restent avec idEnseignant NULL : rien ne permet de déduire un
-- propriétaire fiable pour elles, et la colonne est nullable précisément pour ce cas.

-- 3. Contrainte de clé étrangère.
ALTER TABLE `Epreuve` ADD CONSTRAINT `Epreuve_idEnseignant_fkey` FOREIGN KEY (`idEnseignant`) REFERENCES `Enseignant`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
