import { Groupe, Utilisateur } from "../model";
import { loadGroupe } from "../depenseManager";
import inquirer from "inquirer";
import { deleteGroup } from "../features/supprimergroupe";
import { ajouterMembreAuGroupe } from "./ajoutMembre";
import { afficherMembresDuGroupe } from "./Affichermenbre";
import { supprimerMembreDuGroupe } from "./supprimermembre";
import { afficherRapportHebdomadaire, genererRapportHebdomadaire } from "./rapport";
import { menuPaiements } from "./paiementManager";

export async function afficherGroupes(user: Utilisateur) {
    const { groupes } = loadGroupe();

    // Les groupes dont l'utilisateur est le chef
    const mesGroupes = groupes.filter((g) => g.chefDeGroupe === user.id);

    if (mesGroupes.length === 0) {
        console.log("❌ Vous n'avez créé aucun groupe.");
        return;
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

    const groupe = groupes.find(g => g.id === groupeChoisi);

    if (!groupe) {
        console.log("❌ Groupe introuvable.");
        return;
    }

    const { action } = await inquirer.prompt([
        {
            type: "list",
            name: "action",
            message: "Que voulez-vous faire dans ce groupe ?",
            choices: [
                "Ajouter une dépense",
                "Voir les membres",
                "Ajouter des membres",
                "Effectuer un paiement",
                "Afficher rapport",
                "Supprimer un membre",
                "Supprimer le groupe",
                "Retour",
            ],
        },
    ]);

    switch (action) {
        case "Ajouter une dépense":
            console.log("📝 Ajouter une dépense - Fonctionnalité à implémenter.");
            break;

        case "Voir les membres":
            await afficherMembresDuGroupe(groupe);
            break;
        
        case "Ajouter des membres":
            await ajouterMembreAuGroupe(groupe);
            break;
            // Dans votre fonction afficherGroupes ou menu principal
        case "Effectuer un paiement":
            await menuPaiements(user);
            break;
         case "Afficher rapport":
            
            const rapport = genererRapportHebdomadaire(groupe.id);
            if (rapport) {
                afficherRapportHebdomadaire(rapport);
            } else {
                console.log("❌ Impossible de générer le rapport pour ce groupe.");
            }
            break;

        case "Supprimer un membre":
            await supprimerMembreDuGroupe(groupe);
            break;

        case "Supprimer le groupe":
            await deleteGroup(groupe);
            break;

        case "Retour":
            return;
    }
}
