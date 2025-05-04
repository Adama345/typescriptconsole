import { Utilisateur } from "../model";
import { loadUser, saveUser } from "../depenseManager";
import inquirer from "inquirer";

let User: Utilisateur[] = loadUser();
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
    const user = User.find(
        (u) =>
            u.telephone === loginInfo.telephone &&
            u.password === loginInfo.password
    );

    if (user) {
        console.log(`Connexion reussie`);
        await menuUtilisateur(user);
        // Ici, tu peux stocker l'utilisateur connecté pour les autres actions
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
            break;
        case "Voir mes goupes":
            break;
        case "Gerer Mon Compte":
            break;
        case "Me deconnecter":
            console.log("Déconnexion effectuée !");
            return;
    }
    await menuUtilisateur(user); // Boucle tant que connecté
}
