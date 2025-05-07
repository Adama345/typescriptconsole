import inquirer from "inquirer";

import { Groupe, Utilisateur } from "../model";
import { loadGroupe, loadUser, loadDepense, savedepense } from "../depenseManager";
import { deleteGroup } from "../features/supprimergroupe";
import { ajouterDepense } from "./ajouterDepense";
import { supprimerDepense } from "./supprimerDepense";
import { modifierDepense } from "./modifierDepense";

import { deleteGroup } from "./supprimergroupe";
import { ajouterMembreAuGroupe } from "./ajoutMembre";
import { afficherMembresDuGroupe } from "./Affichermenbre";
import { supprimerMembreDuGroupe } from "./supprimermembre";
import { modifierGroupe } from "./modifierGroupes";
import { menuPaiements } from "./paiementManager";
import {
    afficherRapportHebdomadaire,
    genererRapportHebdomadaire,
} from "./rapport";

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

                name: "action",
                message: "Que voulez-vous faire dans ce groupe",
                choices: [
                    "Ajouter une depense",
                    "Voir les membres",
                    "Ajouter des membres",
                    "Modifier Groupe",
                    "Effectuer un paiement",
                    "Afficher le rapport",
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
                const groupeSelectionne = groupes.find(
                    (g) => g.id === groupeChoisi
                );
                if (groupeSelectionne) {
                    await afficherMembresDuGroupe(groupeSelectionne);
                }
                break;
            case "Ajouter des membres":
                const ajoutMembre = mesGroupes.find(
                    (g) => g.id === groupeChoisi
                );
                if (ajoutMembre) {
                    await ajouterMembreAuGroupe(ajoutMembre);
                } else {
                    console.log(
                        "Seule l'admin du groupe a le droit d'ajouter des membres"
                    );
                }
                break;
            case "Modifier Groupe":
                const modifierGroup = mesGroupes.find(
                    (g) => g.id === groupeChoisi
                );
                if (modifierGroup) {
                    await modifierGroupe(modifierGroup);
                } else {
                    console.log(
                        "Seule l'admin du groupe a le droit de le modifier"
                    );
                }
                break;
            case "Effectuer un paiement":
                await menuPaiements(user);
                break;
            case "Afficher le rapport":
                const rapportGroup = groupes.find((g) => g.id === groupeChoisi);
                if (rapportGroup) {
                    const rapport = genererRapportHebdomadaire(rapportGroup.id);
                    if (rapport) {
                        await afficherRapportHebdomadaire(rapport);
                    }
                }
                break;
            case "Supprimer um membre":
                const supprimerMembre = mesGroupes.find(
                    (g) => g.id === groupeChoisi
                );
                if (supprimerMembre) {
                    await supprimerMembreDuGroupe(supprimerMembre);
                } else {
                    console.log(
                        "Seule l'admin du groupe a le droit de supprimer des membres"
                    );
                }
                break;
            case "Supprimer le groupe":
                const groupeASupprimer = mesGroupes.find(
                    (g) => g.id === groupeChoisi
                );
                if (groupeASupprimer) {
                    await deleteGroup(groupeASupprimer);
                } else {
                    console.log(
                        "Seule l'admin du groupe a le droit de le supprimer"
                    );
                }
                break;
            case "Retour":
                return;

        }
    }
}