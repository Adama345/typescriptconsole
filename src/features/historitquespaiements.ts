// Importation des fonctions pour charger les données
import { loadData, loadPayer } from "../depenseManager";

/**
 * Fonction pour afficher l'historique des dépenses d'un groupe spécifique
 *  - l'ID du groupe à analyser
 */

export async function paymentHystorique(groupeId: number) {
    // Chargement de toutes les données (dépenses, paiements, etc.)
    const data = loadData();

    // Filtre les dépenses qui appartiennent au groupe spécifié
    const depenseGroupe = data.depenses.filter((d) => d.groupeId === groupeId);

    // Si aucune dépense n'existe dans ce groupe, affiche un message et sort
    if (depenseGroupe.length === 0) {
        console.log("Il y pas de depense dans ce groupe");
        return;
    }

    // Affiche un en-tête indiquant que c'est l'historique du groupe
    console.log(`\n📜 Historique des dépenses du groupe ${groupeId} :\n`);

    // Parcourt chaque dépense pour afficher ses détails
    depenseGroupe.forEach((depense) => {
        console.log(`🧾 Dépense: ${depense.nom}`); // Nom de la dépense
        console.log(`💰 Montant total: ${depense.montant} FCFA`); // Montant total dépensé
        // Affiche la date de la dépense formatée en locale
        console.log(`📅 Date: ${new Date(depense.date).toLocaleDateString()}`);
        console.log("👥 Paiements :"); // Introduction à la liste des paiements

        // Si la dépense a des paiements, les affiche
        depense.paiements?.forEach((paiement) => {
            console.log(
                `- Membre ${paiement.membreId} a payé ${
                    paiement.sold
                } FCFA le ${new Date(paiement.date).toLocaleDateString()}`
            );
        });
        // Ajoute un séparateur visuel pour améliorer la lisibilité
        console.log("\n-----------------------------\n");
    });
}