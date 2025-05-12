// Import des modules et types nécessaires  
import { Utilisateur } from "../model"; // Modèle utilisateur  
import { loadUser, saveUser } from "../depenseManager"; // Fonctions pour charger et sauvegarder les utilisateurs  
import inquirer from "inquirer"; // Interface CLI pour prompts interactifs  
import chalk from "chalk"; // Pour la coloration du texte dans la console  
import boxen from "boxen"; // Boîtes stylisées pour mieux structurer l'affichage  

/**  
 * Fonction de gestion du compte utilisateur : modification ou suppression  
 * @param user - l'utilisateur connecté  
 * @returns Promise<boolean> - vrai si le compte a été supprimé, sinon false  
 */  
export async function gestionCompte(user: Utilisateur): Promise<boolean> {  
    // Affiche un titre dans une boîte stylisée en bleu avec une bordure ronde  
    console.log(  
        boxen(chalk.bold.blueBright("👤 Gestion de votre Compte"), {  
            padding: 1,  
            margin: 1,  
            borderColor: "cyan",  
            borderStyle: "round",  
        })  
    );  

    // Propose à l'utilisateur ce qu'il souhaite faire : modifier, supprimer ou revenir  
    const { action } = await inquirer.prompt([  
        {  
            type: "list", // Sélection dans une liste  
            name: "action",  
            message: chalk.yellow("Que voulez-vous faire sur votre compte ?"),  
            choices: [  
                { name: chalk.green("✏️ Modifier mes informations"), value: "modifier" },  
                { name: chalk.red("🗑️ Supprimer mon compte"), value: "supprimer" },  
                { name: chalk.blue("🔙 Retour"), value: "retour" },  
            ],  
        },  
    ]);  

    // Si l'utilisateur choisit "retour", affiche un message et retourne false (aucune suppression)  
    if (action === "retour") {  
        console.log(chalk.yellow("🔙 Retour au menu précédent..."));  
        return false;  
    }  

    // Si l'utilisateur souhaite modifier ses informations  
    if (action === "modifier") {  
        let continuer = true; // Contrôle la boucle de modifications répétées  

        while (continuer) {  
            // Affiche un titre stylisé pour la section modification  
            console.log(  
                boxen(chalk.magentaBright("✨ Modification des informations ✨"), {  
                    padding: 1,  
                    margin: 1,  
                    borderColor: "magenta",  
                })  
            );  

            // Propose quel champ modifier (nom, prénom, etc.)  
            const { champ } = await inquirer.prompt([  
                {  
                    type: "list",  
                    name: "champ",  
                    message: chalk.cyan("Quel champ voulez-vous modifier ?"),  
                    choices: [  
                        "Nom",  
                        "Prénom",  
                        "Téléphone",  
                        "Email",  
                        "Mot de passe",  
                        "Retour", // Option pour sortir de la modification  
                    ],  
                },  
            ]);  

            // Si "Retour" est choisi, sortira de la boucle  
            if (champ === "Retour") break;  

            // Demande la nouvelle valeur pour le champ sélectionné  
            const { nouvelleValeur } = await inquirer.prompt([  
                {  
                    type: "input",  
                    name: "nouvelleValeur",  
                    message: chalk.green(`Entrez le nouveau ${champ.toLowerCase()} :`),  
                },  
            ]);  

            // Modifie la propriété de l'objet utilisateur selon le champ choisi  
            switch (champ) {  
                case "Nom":  
                    user.nom = nouvelleValeur;  
                    break;  
                case "Prénom":  
                    user.prenom = nouvelleValeur;  
                    break;  
                case "Téléphone":  
                    user.telephone = nouvelleValeur;  
                    break;  
                case "Email":  
                    user.email = nouvelleValeur;  
                    break;  
                case "Mot de passe":  
                    user.password = nouvelleValeur;  
                    break;  
            }  

            // Met à jour la liste des utilisateurs dans le stockage  
            const { users } = loadUser(); // Récupère tous les users  
            const index = users.findIndex((u) => u.id === user.id); // Trouve l'index de l'utilisateur  
            if (index !== -1) {  
                // Remplace l'utilisateur par la version modifiée  
                users[index] = { ...user };  
                // Sauvegarde la liste mise à jour  
                saveUser(users);  

                // Envoie une notification système de succès avec node-notifier  
                const notifier = require("node-notifier");  
                notifier.notify({  
                    title : "success",  
                    message : "Modification effectuée",  
                    icon : "img/icon.jpg"  
                });  

                               // Affiche une boîte stylisée pour confirmer que la mise à jour a été effectuée avec succès
                console.log(
                    boxen(chalk.bold.green("✅ Information mise à jour avec succès !"), {
                        padding: 1,
                        margin: 1,
                        borderColor: "green",
                        borderStyle: "double",
                    })
                );
            }

            // Demande si l'utilisateur souhaite continuer à modifier d'autres champs
            const { encore } = await inquirer.prompt([
                {
                    type: "confirm",
                    name: "encore",
                    message: chalk.yellow("Souhaitez-vous modifier un autre champ ?"),
                },
            ]);
            // Si l'utilisateur ne veut pas continuer, la boucle s'arrête
            continuer = encore;
        }
    }

    // Si l'action était de supprimer le compte
    if (action === "supprimer") {
        // Demande une confirmation avant suppression
        const { confirmation } = await inquirer.prompt([
            {
                type: "confirm",
                name: "confirmation",
                message: chalk.red.bold(
                    "⚠️ Voulez-vous vraiment supprimer votre compte ? Cette action est irréversible !"
                ),
            },
        ]);

        if (confirmation) {
            // Récupère tous les utilisateurs
            const { users } = loadUser();
            // Filtre pour supprimer le user actuel
            const newUserList = users.filter((u) => u.id !== user.id);
            // Sauvegarde la nouvelle liste sans l'utilisateur
            saveUser(newUserList);

            // Affiche une boîte indiquant la suppression
            console.log(
                boxen(chalk.red.bold("🗑️ Compte supprimé avec succès !"), {
                    padding: 1,
                    margin: 1,
                    borderColor: "red",
                    borderStyle: "bold",
                })
            );
            // Retourne true pour indiquer que le compte a été supprimé
            return true;
        } else {
            // Annulation de la suppression
            console.log(chalk.green("✅ Suppression annulée !"));
        }
    }

    // Retourne false si aucune suppression n'a eu lieu
    return false;
}