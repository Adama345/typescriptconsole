import { Groupe, Utilisateur } from "../model";
import { loadGroupe } from "../depenseManager";
import inquirer from "inquirer";

export async function afficherGroupes(user: Utilisateur) {
    const groupes: Groupe[] = loadGroupe();

    const mesGroupes = groupes.filter((g) => g.membreId?.includes(user.id));

    if (mesGroupes.length === 0) {
        console.log("Vous n'êtes membre d'aucun groupe.");
        return null;
    }

    const { groupeChoisi } = await inquirer.prompt([
        {
            type: "list",
            name: "groupeChoisi",
            message: "Sélectionnez un groupe :",
            choices: mesGroupes.map((groupe) => ({
                name: `${groupe.nom} - ${groupe.description}`,
                value: groupe.id,
            })),
        },
    ]);

    if (groupeChoisi) {
        const { action } = await inquirer.prompt([
            {
                type: "list",
                name: "action",
                message: "Que voulez-vous faire dans ce groupe",
                choices: [
                    "Ajouter une depense",
                    "Voir les membres",
                    "Ajouter des membres",
                    "Supprimer um membre",
                    "Supprimer le groupe",
                    "Retour",
                ],
            },
        ]);
        switch (action) {
            case "Ajouter une depense":
                console.log("ajouter une depense");
                break;
            case "Voir les membres":
                console.log("voir les depenses");
                break;
            case "Ajouter des membres":
                console.log("Ajouter des membres");
                break;
            case "Supprimer um membre":
                console.log("Supprimer um membre");

                break;
            case "Supprimer le groupe":
                console.log("Supprimer le groupe");
                break;
            case "Retour":
                return;
        }
    }
}
