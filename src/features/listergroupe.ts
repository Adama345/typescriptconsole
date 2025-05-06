import { Groupe, Utilisateur } from "../model";
import { loadGroupe } from "../depenseManager";
import inquirer from "inquirer";

import { deleteGroup } from "./supprimergroupe";
import { ajouterMembreAuGroupe } from "./ajoutMembre";
import { afficherMembresDuGroupe } from "./Affichermenbre";
import { supprimerMembreDuGroupe } from "./supprimermembre";
import { modifierGroupe } from "./modifierGroupes";


export async function afficherGroupes(user: Utilisateur) {
    const { groupes } = loadGroupe();

    //cette variable stocke le groupe au quel l'utilisateur appartien
    const joiGroupes = groupes.filter((g) => g.membreId?.includes(user.id));
    //cette variable stocke les groupe que j'ai creer
    const mesGroupes = groupes.filter((g) => g.chefDeGroupe === user.id);

    // const lesGroupe = joiGroupes.concat(mesGroupes);
    const groupeMap = new Map<number, Groupe>();
    [...joiGroupes, ...mesGroupes].forEach((g) => {
        groupeMap.set(g.id, g); // si un groupe a déjà cet id, il ne sera pas dupliqué
    });
    const lesGroupe = Array.from(groupeMap.values());

    if (joiGroupes.length === 0 && mesGroupes.length === 0) {
        console.log("Vous n'êtes membre d'aucun groupe.");
        return null;
    }

    const { groupeChoisi } = await inquirer.prompt([
        {
            type: "list",
            name: "groupeChoisi",
            message: "Sélectionnez un groupe :",
            choices: lesGroupe.map((groupe) => ({
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
                    "Modifier Groupe",
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
                const groupeSelectionne = groupes.find(g => g.id === groupeChoisi);
                if (groupeSelectionne) {
                    await afficherMembresDuGroupe(groupeSelectionne);
                }
                break;
             
            case "Ajouter des membres":
                const ajoutMembre = mesGroupes.find((g) => g.id === groupeChoisi);
                if (ajoutMembre) {
                    await ajouterMembreAuGroupe(ajoutMembre);
                }else{
                    console.log("Seule l'admin du groupe a le droit d'ajouter des membres");  
                }
                break;
            case "Modifier Groupe":
                const modifierGroup = mesGroupes.find((g) => g.id === groupeChoisi);
                if (modifierGroup) {
                    await modifierGroupe(modifierGroup);
                }else{
                    console.log("Seule l'admin du groupe a le droit de le modifier");  
                }
                break;
            case "Supprimer um membre":
                const supprimerMembre = mesGroupes.find((g) => g.id === groupeChoisi);
                if (supprimerMembre) {
                    await supprimerMembreDuGroupe(supprimerMembre);
                }else{
                    console.log("Seule l'admin du groupe a le droit de supprimer des membres");  
                }
                break;
            case "Supprimer le groupe":
                const groupeASupprimer = mesGroupes.find((g) => g.id === groupeChoisi);
                if (groupeASupprimer) {
                    await deleteGroup(groupeASupprimer);
                }else{
                    console.log("Seule l'admin du groupe a le droit de le supprimer");  
                }
                break;
            case "Retour":
                return;
        }
    }
}
