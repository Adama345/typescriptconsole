import { Groupe, Utilisateur } from "../model";
import { loadGroupe, savegroupe } from "../depenseManager";
import inquirer from "inquirer";

export async function deleteGroup(groupe: Groupe) {
    // const { groups }: { groups: Groupe[] } = loadGroupe();
    const { groupes }: { groupes: Groupe[] } = loadGroupe();

    const { confirm } = await inquirer.prompt([
        {
            type: "confirm",
            name: "confirm",
            message: `Voulez-vous vraiment supprimer le groupe "${groupe.nom}" ?`,
        },
    ]);
    if (confirm) {
        const newGroupes = groupes.filter((g) => g.id !== groupe.id);
        savegroupe(newGroupes);
        console.log("groupe supprimé !");
        return true;
    }
}
