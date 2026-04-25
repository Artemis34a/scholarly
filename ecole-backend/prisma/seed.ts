import 'dotenv/config';
import { PrismaClient, TypePersonne } from '@prisma/client';

const prisma = new PrismaClient();

function randomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function main() {
  console.log('Nettoyage de la base de données existante...');
  await prisma.frequente.deleteMany();
  await prisma.cours.deleteMany();
  await prisma.enseignant.deleteMany();
  await prisma.titulaire.deleteMany();
  await prisma.salle.deleteMany();
  await prisma.classe.deleteMany();
  await prisma.session.deleteMany();
  await prisma.trimestre.deleteMany();
  await prisma.anneeAcademique.deleteMany();
  await prisma.cycle.deleteMany();
  await prisma.parent.deleteMany();
  await prisma.eleve.deleteMany();
  await prisma.villeNaissance.deleteMany();
  await prisma.resident.deleteMany();
  await prisma.quartier.deleteMany();
  await prisma.personne.deleteMany();
  await prisma.admin.deleteMany();

  console.log('Création de l\'administrateur principal...');
  const admin = await prisma.admin.create({
    data: {
      nom: 'Super Admin',
      username: 'admin',
      password: 'admin123',
      mobile: '0601020304',
      actif: true,
    },
  });

  console.log('Création des quartiers et des villes de naissance...');
  const quartiers = await prisma.quartier.createMany({
    data: [
      { libelle: 'Centre-ville', description: 'Quartier central et animé.' },
      { libelle: 'Bellevue', description: 'Quartier résidentiel calme.' },
      { libelle: 'Rivière', description: 'Proche de la rivière et des écoles.' },
    ],
  });

  const villes = await prisma.villeNaissance.createMany({
    data: [
      { libelle: 'Paris' },
      { libelle: 'Lyon' },
      { libelle: 'Toulouse' },
      { libelle: 'Marseille' },
    ],
  });

  const quartierList = await prisma.quartier.findMany();
  const villeList = await prisma.villeNaissance.findMany();

  console.log('Création des personnes...');
  const personnesData = [
    { nom: 'Dubois', prenom: 'Claire', typePersonne: TypePersonne.PARENT, username: 'claire.dubois', password: 'passParent1', mobile: '0650012300', phone: '0142233445' },
    { nom: 'Moussa', prenom: 'Karim', typePersonne: TypePersonne.DIRECTEUR, username: 'karim.moussa', password: 'passDirecteur', mobile: '0650067890' },
    { nom: 'Nguyen', prenom: 'Sophie', typePersonne: TypePersonne.ENSEIGNANT, username: 'sophie.nguyen', password: 'passProf1', mobile: '0650098765' },
    { nom: 'Koffi', prenom: 'Yann', typePersonne: TypePersonne.ENSEIGNANT, username: 'yann.koffi', password: 'passProf2', mobile: '0650076543' },
    { nom: 'Martin', prenom: 'Lucas', typePersonne: TypePersonne.PARENT, username: 'lucas.martin', password: 'passParent2', mobile: '0650087654' },
    { nom: 'Ngoma', prenom: 'Amina', typePersonne: TypePersonne.PARENT, username: 'amina.ngoma', password: 'passParent3', mobile: '0650034567' },
  ];

  const personnes: any[] = [];
  for (const personne of personnesData) {
    const created = await prisma.personne.create({
      data: {
        ...personne,
        dateNaissance: randomDate(new Date(1980, 0, 1), new Date(2000, 11, 31)),
        lieuNaissance: 'Lyon',
        idAdmin: admin.id,
      },
    });
    personnes.push(created);
  }

  console.log('Création des élèves...');
  const elevesData = [
    { nom: 'Bernard', prenom: 'Élise', dateNaissance: new Date(2014, 4, 17), lieuNaissance: 'Paris', sexe: 2, langue: 'Français', photoURL: null },
    { nom: 'Kouame', prenom: 'Noé', dateNaissance: new Date(2013, 9, 2), lieuNaissance: 'Toulouse', sexe: 1, langue: 'Français', photoURL: null },
    { nom: 'Petit', prenom: 'Lina', dateNaissance: new Date(2015, 1, 28), lieuNaissance: 'Marseille', sexe: 2, langue: 'Français', photoURL: null },
  ];

  const eleves: any[] = [];
  for (const [index, eleve] of elevesData.entries()) {
    const created = await prisma.eleve.create({
      data: {
        ...eleve,
        idVilleNaissance: villeList[index % villeList.length].id,
        idAdmin: admin.id,
      },
    });
    eleves.push(created);
  }

  console.log('Création des parents et des résidents...');
  await prisma.parent.createMany({
    data: [
      { idEleve: eleves[0].id, idPers: personnes[0].id, idAdmin: admin.id },
      { idEleve: eleves[1].id, idPers: personnes[4].id, idAdmin: admin.id },
      { idEleve: eleves[2].id, idPers: personnes[5].id, idAdmin: admin.id },
    ],
  });

  await prisma.resident.createMany({
    data: [
      { idPers: personnes[0].id, idQuartier: quartierList[0].id, description: 'Famille très engagée dans l\'école.' },
      { idPers: personnes[4].id, idQuartier: quartierList[1].id, description: 'Habite près du parc.' },
      { idPers: personnes[5].id, idQuartier: quartierList[2].id, description: 'Parent d\'un élève en primaire.' },
    ],
  });

  console.log('Création des cycles, classes, salles et cours...');
  const cycle = await prisma.cycle.create({
    data: {
      libelle: 'Cycle 1',
      description: 'Cycle fondamental pour les classes primaires.',
      idAdmin: admin.id,
    },
  });

  const classes = await prisma.classe.createMany({
    data: [
      { libelle: 'CP', idCycle: cycle.id, idAdmin: admin.id },
      { libelle: 'CE1', idCycle: cycle.id, idAdmin: admin.id },
    ],
  });

  const classesList = await prisma.classe.findMany();

  const sallesData = [
    { libelle: 'Salle A', position: 'Rez-de-chaussée', surface: '45m2', idClasse: classesList[0].id, actif: true, idAdmin: admin.id },
    { libelle: 'Salle B', position: '1er étage', surface: '50m2', idClasse: classesList[1].id, actif: true, idAdmin: admin.id },
  ];
  const salles = await prisma.salle.createMany({ data: sallesData });
  const sallesList = await prisma.salle.findMany();

  const coursData = [
    { libelle: 'Mathématiques', coefficient: 3, idClasse: classesList[0].id, actif: true, description: 'Cours de base sur les nombres et les formes.', idAdmin: admin.id },
    { libelle: 'Français', coefficient: 2, idClasse: classesList[0].id, actif: true, description: 'Lecture, écriture et expression orale.', idAdmin: admin.id },
    { libelle: 'Sciences', coefficient: 1.5, idClasse: classesList[1].id, actif: true, description: 'Découverte de la nature et de la physique simple.', idAdmin: admin.id },
  ];

  const coursList: any[] = [];
  for (const cours of coursData) {
    const created = await prisma.cours.create({ data: cours });
    coursList.push(created);
  }

  console.log('Création des enseignants et titulaires...');
  const enseignant1 = await prisma.enseignant.create({
    data: {
      idPers: personnes[2].id,
      idCours: coursList[0].id,
      actif: true,
      idAdmin: admin.id,
    },
  });

  const enseignant2 = await prisma.enseignant.create({
    data: {
      idPers: personnes[3].id,
      idCours: coursList[1].id,
      actif: true,
      idAdmin: admin.id,
    },
  });

  await prisma.titulaire.create({
    data: {
      idSalle: sallesList[0].id,
      idPers: personnes[2].id,
      actif: true,
      idAdmin: admin.id,
    },
  });

  console.log('Création des années académiques, trimestres et sessions...');
  const annee = await prisma.anneeAcademique.create({
    data: {
      libelle: '2025-2026',
      periode: 'Septembre - Juillet',
      idAdmin: admin.id,
    },
  });

  const trimestre1 = await prisma.trimestre.create({
    data: {
      libelle: 'Trimestre 1',
      periode: 'Septembre - Décembre',
      idAca: annee.id,
      idAdmin: admin.id,
    },
  });

  await prisma.session.createMany({
    data: [
      { libelle: 'Session 1', description: 'Début de l\'année scolaire', idTrimestre: trimestre1.id, idAdmin: admin.id },
      { libelle: 'Session 2', description: 'Fin du trimestre 1', idTrimestre: trimestre1.id, idAdmin: admin.id },
    ],
  });

  console.log('Création des fréquentations élèves-salles...');
  await prisma.frequente.createMany({
    data: [
      { idSalle: sallesList[0].id, idEleve: eleves[0].id, commentaire: 'Présent tous les jours.', idAdmin: admin.id },
      { idSalle: sallesList[1].id, idEleve: eleves[1].id, commentaire: 'Participe bien aux activités.', idAdmin: admin.id },
      { idSalle: sallesList[0].id, idEleve: eleves[2].id, commentaire: 'Élève calme et attentif.', idAdmin: admin.id },
    ],
  });

  console.log('Données générées avec succès.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
