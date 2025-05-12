import { RapportHebdomadaire } from "../model";
import { loadData, saveData } from "../depenseManager"; // Supposons que vos fonctions de chargement sont dans ce fichier
import { genererRapportPDF } from "./genererpdf";
import chalk from "chalk"; // Ajoutez cette bibliothèque pour ajouter de la couleur

export function genererRapportHebdomadaire(groupeId: number): RapportHebdomadaire | null {
    const data = loadData();

    // Vérifier si le groupe existe
    const groupe = data.groups.find((g) => g.id === groupeId);
    if (!groupe) {
        console.error(chalk.red("❌ Groupe non trouvé"));
        return null;
    }

    // Calculer les dates (semaine précédente)
    const maintenant = new Date();
    const dateFin = new Date(maintenant);
    const dateDebut = new Date(maintenant);
    dateDebut.setDate(dateFin.getDate() - 7); // 7 jours en arrière

    // Filtrer strictement les dépenses du groupe spécifié pour la période
    const depensesSemaine = data.depenses.filter(
        (d) =>
            d.groupeId === groupeId && // Seulement les dépenses du groupe
            new Date(d.date) >= dateDebut &&
            new Date(d.date) <= dateFin
    );

    // Filtrer strictement les paiements du groupe spécifié pour la période
    const paiementsSemaine = data.Payer.filter((p) => {
        const depenseAssociee = data.depenses.find((d) => d.id === p.depenseId);
        return (
            depenseAssociee &&
            depenseAssociee.groupeId === groupeId && // Seulement les paiements liés aux dépenses du groupe
            new Date(p.date) >= dateDebut &&
            new Date(p.date) <= dateFin
        );
    });

    // Calculer les totaux uniquement pour ce groupe
    const depensesTotal = depensesSemaine.reduce((sum, d) => sum + d.montant, 0);
    const paiementsTotal = paiementsSemaine.reduce((sum, p) => sum + p.sold, 0);

    // Calculer par membre uniquement pour ce groupe
    const depensesParMembre: { [key: number]: number } = {};
    const paiementsParMembre: { [key: number]: number } = {};

    // Seulement les membres de ce groupe
    groupe.membreId?.forEach((membreId) => {
        // Dépenses où le membre est concerné dans ce groupe
        depensesParMembre[membreId] = depensesSemaine
            .filter((d) => d.membreId?.includes(membreId))
            .reduce((sum, d) => sum + d.montant / (d.membreId?.length || 1), 0);

        // Paiements du membre dans ce groupe
        paiementsParMembre[membreId] = paiementsSemaine
            .filter((p) => p.membreId === membreId)
            .reduce((sum, p) => sum + p.sold, 0);
    });

    // Créer le rapport
    const rapport: RapportHebdomadaire = {
        id: Date.now(),
        dateDebut,
        dateFin,
        depensesTotal,
        paiementsTotal,
        solde: paiementsTotal - depensesTotal,
        depensesParMembre: Object.entries(depensesParMembre).map(
            ([membreId, montant]) => ({
                membreId: Number(membreId),
                montant,
            })
        ),
        paiementsParMembre: Object.entries(paiementsParMembre).map(
            ([membreId, montant]) => ({
                membreId: Number(membreId),
                montant,
            })
        ),
        groupeId,
    };

    // Sauvegarder le rapport
    data.Rapport.push({
        id: rapport.id,
        periode: new Date(),
        description: `Rapport hebdomadaire du ${dateDebut.toLocaleDateString()} au ${dateFin.toLocaleDateString()}`,
        membreId: groupe.membreId,
        chefDeGroupe: groupe.chefDeGroupe,
    });

    saveData(data);

    return rapport;
}



export async function afficherRapportHebdomadaire(rapport: RapportHebdomadaire, options: { pdf?: string } = {}) {
    const data = loadData();

    console.log(chalk.blue.bold("\n=== RAPPORT HEBDOMADAIRE ==="));
    console.log(chalk.green(`📅 Période: ${rapport.dateDebut.toLocaleDateString()} - ${rapport.dateFin.toLocaleDateString()}`));
    console.log(chalk.green(`👥 Groupe: ${data.groups.find(g => g.id === rapport.groupeId)?.nom}`));

    console.log(chalk.yellow("\n--- Totaux ---"));
    console.log(chalk.cyan(`💸 Dépenses totales: ${rapport.depensesTotal.toFixed(2)} FCFA`));
    console.log(chalk.cyan(`💰 Paiements totaux: ${rapport.paiementsTotal.toFixed(2)} FCFA`));
    console.log(chalk.magenta(`🔑 Solde: ${rapport.solde.toFixed(2)} FCFA`));

    console.log(chalk.yellow("\n--- Dépenses par membre ---"));
    rapport.depensesParMembre.forEach(item => {
        const membre = data.users.find(u => u.id === item.membreId);
        console.log(`${chalk.blue(membre?.prenom)} ${chalk.blue(membre?.nom)}: ${chalk.green(item.montant.toFixed(2))} XOF`);
    });

    console.log(chalk.yellow("\n--- Paiements par membre ---"));
    rapport.paiementsParMembre.forEach(item => {
        const membre = data.users.find(u => u.id === item.membreId);
        console.log(`${chalk.blue(membre?.prenom)} ${chalk.blue(membre?.nom)}: ${chalk.green(item.montant.toFixed(2))} XOF`);
    });

    // Générer le PDF si demandé
    if (options.pdf) {
        try {
            await genererRapportPDF(rapport, options.pdf);
            console.log(chalk.green(`\nRapport PDF généré: ${options.pdf}`));
        } catch (error) {
            console.error(chalk.red("\nErreur lors de la génération du PDF:", error));
        }
    }
}
