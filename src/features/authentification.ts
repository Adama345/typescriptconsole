import { Utilisateur } from "../model";
import { loadUser, loadGroupe } from "../depenseManager";
import inquirer from "inquirer";
import { gestionCompte } from "./gererCompte";
import { createGroupe } from "../features/createGroupe";
import { afficherGroupes } from "../features/listergroupe";
import { Groupe } from "../model";

// let User: Utilisateur[] = loadUser();
export async function seconnecter() {
    const loginInfo = await inquirer.prompt([
        {
            type: "input",
            name: "telephone",
            message: "Votre numéro de téléphone :",
        },
        {
            type: "password",
            name: "password",
            message: "Votre mot de passe :",
        },
    ]);
    const users = loadUser();
    const user = users.find(
        (u) =>
            u.telephone === loginInfo.telephone &&
            u.password === loginInfo.password
    );

    if (user) {
        console.log(`Connexion reussie`);
        await menuUtilisateur(user);
    } else {
        console.log("Identifiants incorrects !");
    }
}

async function menuUtilisateur(user: Utilisateur) {
    const { action } = await inquirer.prompt([
        {
            type: "list",
            name: "action",
            message: `Bienvenue Sur votre compe ${user.prenom}`,
            choices: [
                "Creer un groupe",
                "Voir mes goupes",
                "Gerer Mon Compte",
                "Me deconnecter",
            ],
        },
    ]);
    switch (action) {
        case "Creer un groupe":
            await createGroupe(user);
            break;
        case "Voir mes goupes":
            await afficherGroupes(user);
            break;
        case "Gerer Mon Compte":
            // await gestionCompte(user);
            const shouldLogout = await gestionCompte(user);
            if (shouldLogout) {
                console.log("Vous êtes maintenant déconnecté.");
                return; // Quitter le menu utilisateur
            }
            break;
        case "Me deconnecter":
            console.log("Déconnexion effectuée !");
            return;
    }
    await menuUtilisateur(user); // Boucle tant que connecté
}
