import inquirer from "inquirer"; // Importe la bibliothèque Inquirer pour les interactions en ligne de commande
import { loadDepense, savedepense } from "../depenseManager"; // Importe les fonctions pour charger et sauvegarder les dépenses
import { Utilisateur } from "../model"; // Importe le type Utilisateur

export async function modifierDepense(user: Utilisateur, groupeId: number) {
    const { depenses } = loadDepense(); // Charge toutes les dépenses enregistrées

    const depensesDuGroupe = depenses.filter(d => d.groupeId === groupeId); // Filtre les dépenses qui appartiennent au groupe donné

    if (depensesDuGroupe.length === 0) {
        console.log("Aucune dépense dans ce groupe."); // Affiche un message si aucune dépense n'existe dans le groupe
        return; // Quitte la fonction
    }

    const { depenseId } = await inquirer.prompt([
        {
            type: "list",
            name: "depenseId",
            message: "Quelle dépense voulez-vous modifier ?",
            choices: depensesDuGroupe.map(d => ({ name: d.nom, value: d.id })) // Propose à l’utilisateur de choisir une dépense par son nom
        }
    ]);

    const dep = depenses.find(d => d.id === depenseId); // Recherche la dépense sélectionnée dans la liste complète
    if (!dep) return; // Si la dépense n’est pas trouvée (cas rare), on quitte la fonction

    const { nom, montant } = await inquirer.prompt([
        { 
            type: "input", 
            name: "nom", 
            message: "Nouveau nom :", 
            default: dep.nom // Propose l'ancien nom comme valeur par défaut
        },
        { 
            type: "input", 
            name: "montant", 
            message: "Nouveau montant :", 
            default: dep.montant.toString(), // Propose l'ancien montant comme valeur par défaut
            validate: (value) => {
                const val = parseFloat(value);
                if (isNaN(val) || val <= 0) { // Valide que le montant est un nombre positif
                    return "Le montant doit être un nombre supérieur à 0";
                }
                return true;
            }
        }
    ]);

    dep.nom = nom; // Met à jour le nom de la dépense
    dep.montant = parseFloat(montant); // Met à jour le montant de la dépense

    savedepense(depenses); // Sauvegarde les dépenses modifiées
    console.log("✅ Dépense modifiée."); // Affiche un message de confirmation
}
