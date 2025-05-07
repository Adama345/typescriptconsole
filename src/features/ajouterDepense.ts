import inquirer from "inquirer"; // Importe la bibliothèque Inquirer pour les interactions en ligne de commande
import { Depense, Groupe, Utilisateur } from "../model"; // Importe les types utilisés pour structurer les données
import { loadDepense, loadGroupe, loadUser, savedepense } from "../depenseManager"; // Importe les fonctions de lecture et sauvegarde des données

export async function ajouterDepense(user: Utilisateur, groupeIdParam?: number) {
    const groupes: Groupe[] = loadGroupe().groupes; // Charge la liste des groupes depuis le fichier
    const depenses: Depense[] = loadDepense().depenses; // Charge la liste des dépenses existantes
    const users: Utilisateur[] = loadUser().users; // Charge la liste des utilisateurs

    const mesGroupes = groupes.filter(
        g => g.chefDeGroupe === user.id || g.membreId?.includes(user.id) // Filtre les groupes dont l'utilisateur est membre ou chef
    );

    if (mesGroupes.length === 0) {
        console.log("❌ Vous n'êtes membre d'aucun groupe."); // Avertit si l'utilisateur ne fait partie d'aucun groupe
        return; // Arrête la fonction
    }

    let groupeId: number | undefined = groupeIdParam; // Initialise l'identifiant du groupe à partir du paramètre ou en demandant à l'utilisateur

    if (!groupeId) {
        const { groupeId: selectedGroupeId } = await inquirer.prompt([
            {
                type: "list",
                name: "groupeId",
                message: "Dans quel groupe voulez-vous ajouter une dépense ?",
                choices: mesGroupes.map(g => ({ name: g.nom, value: g.id })) // Propose une liste des groupes de l'utilisateur
            }
        ]);
        groupeId = selectedGroupeId; // Récupère l'identifiant sélectionné
    }

    const groupe = groupes.find(g => g.id === groupeId!); // Recherche le groupe par son identifiant
    if (!groupe) {
        console.log("❌ Groupe introuvable."); // Avertit si le groupe n'existe pas
        return;
    }

    const { nom, montant } = await inquirer.prompt([
        {
            type: "input",
            name: "nom",
            message: "Nom de la dépense :",
            validate: input => input.trim() !== "" || "Le nom ne peut pas être vide." // Valide que le nom est non vide
        },
        {
            type: "number",
            name: "montant",
            message: "Montant de la dépense :",
            validate: value => {
                const num = Number(value);
                return num > 0 || "Le montant doit être supérieur à 0."; // Valide que le montant est strictement positif
            }
        }
    ]);

    const membres = users.filter(u => groupe.membreId?.includes(u.id)); // Récupère les membres du groupe

    const { membresConcerne } = await inquirer.prompt([
        {
            type: "checkbox",
            name: "membresConcerne",
            message: "Quels membres sont concernés par cette dépense ?",
            choices: membres.map(m => ({
                name: `${m.prenom} (${m.telephone})`,
                value: m.id // Affiche le prénom et téléphone comme choix
            })),
            validate: selected => selected.length > 0 || "Veuillez sélectionner au moins un membre." // Oblige à sélectionner au moins un membre
        }
    ]);

    const nouvelleDepense: Depense = {
        id: Date.now(), // Utilise l'horodatage comme identifiant unique
        nom, // Nom de la dépense saisi
        montant: Number(montant), // Montant converti en nombre
        date: new Date(), // Date actuelle
        chefDeGroupe: user.id, // L'utilisateur est enregistré comme auteur de la dépense
        groupeId: groupeId!, // Identifiant du groupe concerné
        membreId: membresConcerne // Liste des membres concernés par la dépense
    };

    depenses.push(nouvelleDepense); // Ajoute la nouvelle dépense à la liste
    savedepense(depenses); // Sauvegarde la liste mise à jour
    console.log("✅ Dépense ajoutée avec succès !"); // Confirme le succès de l'opération
}
