import inquirer from "inquirer";
import { Groupe, Utilisateur } from "../model";
import { loadGroupe, loadUser, loadDepense, savedepense } from "../depenseManager";
import { deleteGroup } from "../features/supprimergroupe";
import { ajouterDepense } from "./ajouterDepense";
import { supprimerDepense } from "./supprimerDepense";
import { modifierDepense } from "./modifierDepense";

export async function afficherGroupes(user: Utilisateur) {
    const { groupes } = loadGroupe();
    const users: Utilisateur[] = loadUser().users;

    // Groupes dont l'utilisateur est chef
    const mesGroupes = groupes.filter((g) => g.chefDeGroupe === user.id);

    if (mesGroupes.length === 0) {
        console.log("Vous n'êtes chef d'aucun groupe.");
        return;
    }

    let continuerPrincipal = true;

    while (continuerPrincipal) {
        const { groupeChoisi } = await inquirer.prompt([
            {
                type: "list",
                name: "groupeChoisi",
                message: "Sélectionnez un groupe :",
                choices: mesGroupes.map((g) => ({
                    name: `${g.nom} - ${g.description}`,
                    value: g.id,
                })),
            },
        ]);

        const groupe = groupes.find((g) => g.id === groupeChoisi);
        if (!groupe) {
            console.log("Groupe introuvable.");
            continue;
        }

        let actionEnCours = true;

        while (actionEnCours) {
            const { action } = await inquirer.prompt([
                {
                    type: "list",
                    name: "action",
                    message: "Que souhaitez-vous faire dans ce groupe ?",
                    choices: [
                        "Ajouter une dépense",
                        "lister les dépenses",                      
                        "Supprimer une dépense",
                        "Modifier une dépense",
                        "Voir les membres",
                        "Ajouter des membres",
                        "Supprimer un membre",
                        "Supprimer le groupe",
                        "Revenir au menu principal",
                    ],
                },
            ]);

            switch (action) {
                case "Ajouter une dépense":
                    await ajouterDepense(user, groupe.id);
                    break;
                    case "lister les dépenses":
                        {
                            // Récupérer toutes les dépenses du groupe
                            const depenses = loadDepense().depenses.filter(d => d.groupeId === groupe.id);
                            if (depenses.length === 0) {
                                console.log("Aucune dépense dans ce groupe.");
                            } else {
                                console.log("Dépenses du groupe :");
                                depenses.forEach((d) => {
                                    console.log(`- ${d.nom} : ${d.montant} FCFA le ${new Date(d.date).toLocaleDateString()}`);
                                });
                            }
                        }
                        break;
              
                case "Supprimer une dépense": 
                        await supprimerDepense(user, groupe.id);
                        break;
                        case "Modifier une dépense":
                       await modifierDepense(user, groupe.id);
                       break;

                case "Voir les membres":
                    {
                        const membres = users.filter(u => groupe.membreId?.includes(u.id));
                        if (membres.length === 0) {
                            console.log("Aucun membre dans ce groupe.");
                        } else {
                            console.log("Membres du groupe :");
                            membres.forEach((m) => console.log(`- ${m.prenom} (${m.telephone})`));
                        }
                    }
                    break;
                case "Ajouter des membres":
                    // Fonction à implémenter si nécessaire
                    console.log("Fonction d'ajout de membres en cours de développement...");
                    break;
                case "Supprimer un membre":
                    // Fonction à implémenter si nécessaire
                    console.log("Fonction de suppression de membres en cours de développement...");
                    break;
                case "Supprimer le groupe":
                    const groupeASupprimer = groupes.find((g) => g.id === groupeChoisi);
                    if (groupeASupprimer) {
                        await deleteGroup(groupeASupprimer);
                        // Après suppression, sortir de la boucle
                        actionEnCours = false;
                        // Revenir au menu principal des groupes
                        break;
                    }
                    break;
                case "Revenir au menu principal":
                    actionEnCours = false;
                    break;
            }
        }

        // Demander si l'utilisateur veut continuer dans la gestion du groupe
        const { continuer } : { continuer: boolean } = await inquirer.prompt({
            type: "confirm",
            name: "continuer",
            message: "Voulez-vous continuer dans la gestion de ce groupe ?",
            default: false,
        });

        if (!continuer) {
            continuerPrincipal = false;
        }
    }
}