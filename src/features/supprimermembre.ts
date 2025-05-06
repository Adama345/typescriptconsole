import { Groupe, Utilisateur } from "../model";
import { loadGroupe, savegroupe, loadUser } from "../depenseManager";
import inquirer from "inquirer";


export async function supprimerMembreDuGroupe(groupe: Groupe) {
    const { users } = loadUser();

    if (!groupe.membreId || groupe.membreId.length === 0) {
        console.log("Aucun membre à supprimer.");
        return;
    }

    const membres = users.filter(u => groupe.membreId?.includes(u.id));

    const { membreASupprimer } = await inquirer.prompt([
        {
            type: "list",
            name: "membreASupprimer",
            message: "Sélectionnez le membre à supprimer :",
            choices: membres.map(m => ({
                name: `${m.nom} ${m.prenom} | ${m.telephone}`,
                value: m.id
            })),
        }
    ]);

    groupe.membreId = groupe.membreId.filter(id => id !== membreASupprimer);

    console.log("Membre supprimé du groupe.");

    const { groupes } = loadGroupe();
    const index = groupes.findIndex(g => g.id === groupe.id);
    if (index !== -1) {
        groupes[index] = groupe;
        savegroupe(groupes);
    }
}
