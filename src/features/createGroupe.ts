import { Groupe, Utilisateur } from "../model";
import { loadGroupe, loadUser, savegroupe, saveUser } from "../depenseManager";
import inquirer from "inquirer";

export async function createGroupe(user: Utilisateur) {
  let groupe: Groupe[] = loadGroupe();

  const { nom, description } = await inquirer.prompt([
    {
      type: "input",
      name: "nom",
      message: "Saisir le nom du groupe:",
    },
    {
      type: "input",
      name: "description",
      message: "Description du groupe:",
    },
  ]);
  groupe.push({
    id: Date.now(),
    nom,
    description,
    membreId: [user.id],
    chefDeGroupe: user.id,
  });
  savegroupe(groupe);
  console.log("Groupe crée avec succes");
}
