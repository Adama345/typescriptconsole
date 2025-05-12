// Importation des modèles de données et des fonctions de gestion
import { Groupe, Utilisateur } from "../model"; // Modèles de données Groupe et Utilisateur
import { loadGroupe, savegroupe } from "../depenseManager"; // Chargement et sauvegarde des groupes
import inquirer from "inquirer"; // Interface CLI interactive
import chalk from "chalk"; // Couleurs pour la sortie CLI
import boxen from "boxen"; // Boites stylisées pour l'affichage

// Fonction pour créer un nouveau groupe, prenant en paramètre l'utilisateur connecté
export async function createGroupe(user: Utilisateur) {
    // Chargement de la liste des groupes existants
    let { groupes } = loadGroupe();

    // Affiche un titre stylisé dans une boîte avec boxen, en vert gras
    console.log(
        boxen(chalk.bold.green("✨ Création d’un nouveau Groupe ✨"), {
            padding: 1, // Padding intérieur
            margin: 1, // Marges extérieures
            borderColor: "yellow", // Couleur de la bordure
            borderStyle: "round", // Style arrondi
        })
    );

    // Demande à l'utilisateur s'il souhaite créer ou retourner en arrière
    const { action } = await inquirer.prompt([
        {
            type: "list", // Liste de choix
            name: "action",
            message: "Que voulez-vous faire ?",
            choices: [
                { name: chalk.green("➕ Créer un nouveau groupe"), value: "create" },
                { name: chalk.blue("🔙 Retour"), value: "back" },
            ],
        },
    ]);

    // Si l'utilisateur choisit "back", retourne au menu précédent
    if (action === "back") {
        console.log(chalk.yellow("🔙 Retour au menu précédent..."));
        return; // Fin de la fonction
    }

    // Sinon, demande les détails du nouveau groupe
    const { nom, description } = await inquirer.prompt([
        {
            type: "input",
            name: "nom",
            message: chalk.cyan("📝 Saisir le nom du groupe :"),
        },
        {
            type: "input",
            name: "description",
            message: chalk.cyan("💬 Description du groupe :"),
        },
    ]);

    // Ajoute le nouveau groupe à la liste avec ses propriétés
    groupes.push({
        id: Date.now(), // ID unique basé sur timestamp
        nom,
        description,
        membreId: [user.id], // Ajoute l'utilisateur comme membre initial
        chefDeGroupe: user.id, // L'utilisateur est le chef du groupe
    });

    // Sauvegarde la nouvelle liste de groupes
    savegroupe(groupes);

    // Envoie une notification système pour indiquer la réussite
    const notifier = require("node-notifier");
    notifier.notify({
        title: "success", // Titre de la notification
        message: "Groupe creer avec success", // Message de succès
        icon: "img/icon.jpg" // Icône de notification (optionnel)
    });

    // Affiche une boîte stylisée pour confirmer la création du groupe
    console.log(
        boxen(chalk.bold.green("✅ Groupe créé avec succès !"), {
            padding: 1,
            margin: 1,
            borderColor: "green", // Couleur de la bordure
            borderStyle: "double", // Style double
        })
    );
}