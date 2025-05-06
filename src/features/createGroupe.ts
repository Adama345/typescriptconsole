import { Groupe, Utilisateur } from "../model";
import { loadGroupe, loadUser, savegroupe, saveUser } from "../depenseManager";
import inquirer from "inquirer";

export async function createGroupe(user: Utilisateur) {
    let { groupes } = loadGroupe();

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
    groupes.push({
        id: Date.now(),
        nom,
        description,
        membreId: [user.id],
        chefDeGroupe: user.id,
    });
    savegroupe(groupes);
    console.log("Groupe crée avec succes");
}
