import { Utilisateur } from "../model"; // Importe le type Utilisateur
import { loadUser } from "../depenseManager"; // Importe la fonction pour charger les utilisateurs
import inquirer from "inquirer"; // Importe la bibliothèque Inquirer pour les questions interactives
import { gestionCompte } from "./gererCompte"; // Importe la gestion du compte utilisateur
import { createGroupe } from "../features/createGroupe"; // Importe la fonction de création de groupe
import { afficherGroupes } from "../features/listergroupe"; // Importe la fonction d'affichage des groupes de l'utilisateur

export async function seconnecter() {
    const loginInfo = await inquirer.prompt([
        {
            type: "input",
            name: "telephone",
            message: "Votre numéro de téléphone :", // Demande le numéro de téléphone de l’utilisateur
        },
        {
            type: "password",
            name: "password",
            message: "Votre mot de passe :", // Demande le mot de passe de l’utilisateur
        },
    ]);

    const { users } = loadUser(); // Charge les utilisateurs enregistrés
    const user = users.find(
        (u) =>
            u.telephone === loginInfo.telephone &&
            u.password === loginInfo.password // Recherche un utilisateur correspondant au téléphone et au mot de passe
    );

    if (user) {
        console.log(`Connexion reussie`); // Affiche un message de succès
        await menuUtilisateur(user); // Accède au menu utilisateur après la connexion
    } else {
        console.log("Identifiants incorrects !"); // Affiche un message d’erreur si les identifiants sont invalides
    }
}

async function menuUtilisateur(user: Utilisateur) {
    const { action } = await inquirer.prompt([
        {
            type: "list",
            name: "action",
            message: `Bienvenue Sur votre compe ${user.prenom}`, // Affiche un message personnalisé avec le prénom de l’utilisateur
            choices: [
                "Creer un groupe", // Option pour créer un groupe
                "Voir mes goupes", // Option pour voir ses groupes
                "Gerer Mon Compte", // Option pour modifier ses informations
                "Me deconnecter", // Option pour se déconnecter
            ],
        },
    ]);

    switch (action) {
        case "Creer un groupe":
            await createGroupe(user); // Appelle la fonction de création de groupe
            break;
        case "Voir mes goupes":
            await afficherGroupes(user); // Appelle la fonction pour afficher les groupes de l’utilisateur
            break;
        case "Gerer Mon Compte":
            const shouldLogout = await gestionCompte(user); // Appelle la fonction de gestion de compte
            if (shouldLogout) {
                console.log("Vous êtes maintenant déconnecté."); // Message si l’utilisateur a demandé la déconnexion
                return; // Quitte la fonction menu
            }
            break;
        case "Me deconnecter":
            console.log("Déconnexion effectuée !"); // Message de déconnexion
            return; // Quitte la fonction menu
    }

    await menuUtilisateur(user); // Rappelle le menu utilisateur (boucle) tant que l'utilisateur est connecté
}
