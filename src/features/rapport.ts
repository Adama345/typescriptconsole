import { RapportHebdomadaire } from "../model";

import { loadData, saveData } from "../depenseManager"; // Supposons que vos fonctions de chargement sont dans ce fichier



export function genererRapportHebdomadaire(groupeId: number): RapportHebdomadaire | null {
    const data = loadData();
    
    // Vérifier si le groupe existe
    const groupe = data.groups.find(g => g.id === groupeId);
    if (!groupe) {
        console.error("Groupe non trouvé");
        return null;
    }
    
    // Calculer les dates (semaine précédente)
    const maintenant = new Date();
    const dateFin = new Date(maintenant);
    const dateDebut = new Date(maintenant);
    dateDebut.setDate(dateFin.getDate() - 7); // 7 jours en arrière
    
    // Filtrer les dépenses du groupe pour la période
    const depensesSemaine = data.depenses.filter(d => 
        d.chefDeGroupe === groupe.chefDeGroupe && 
        new Date(d.date) >= dateDebut && 
        new Date(d.date) <= dateFin
    );
    
    // Filtrer les paiements du groupe pour la période
    const paiementsSemaine = data.Payer.filter(p => {
        const depenseAssociee = data.depenses.find(d => d.id === p.depenseId);
        return depenseAssociee && depenseAssociee.chefDeGroupe === groupe.chefDeGroupe;
    });
    
    // Calculer les totaux
    const depensesTotal = depensesSemaine.reduce((sum, d) => sum + d.montant, 0);
    const paiementsTotal = paiementsSemaine.reduce((sum, p) => sum + p.sold, 0);
    
    // Calculer par membre
    const depensesParMembre: { [key: number]: number } = {};
    const paiementsParMembre: { [key: number]: number } = {};
    
    groupe.membreId?.forEach(membreId => {
        depensesParMembre[membreId] = depensesSemaine
            .filter(d => d.membreId?.includes(membreId))
            .reduce((sum, d) => sum + (d.montant / (d.membreId?.length || 1)), 0);
            
        paiementsParMembre[membreId] = paiementsSemaine
            .filter(p => p.membreId === membreId)
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
        depensesParMembre: Object.entries(depensesParMembre).map(([membreId, montant]) => ({
            membreId: Number(membreId),
            montant
        })),
        paiementsParMembre: Object.entries(paiementsParMembre).map(([membreId, montant]) => ({
            membreId: Number(membreId),
            montant
        })),
        groupeId
    };
    
    // Sauvegarder le rapport
    data.Rapport.push({
        id: rapport.id,
        periode: new Date(),
        description: `Rapport hebdomadaire du ${dateDebut.toLocaleDateString()} au ${dateFin.toLocaleDateString()}`,
        membreId: groupe.membreId,
        chefDeGroupe: groupe.chefDeGroupe
    });
    
    saveData(data);
    
    return rapport;
}

export function afficherRapportHebdomadaire(rapport: RapportHebdomadaire) {
    const data = loadData();
    
    console.log("=== RAPPORT HEBDOMADAIRE ===");
    console.log(`Période: ${rapport.dateDebut.toLocaleDateString()} - ${rapport.dateFin.toLocaleDateString()}`);
    console.log(`Groupe: ${data.groups.find(g => g.id === rapport.groupeId)?.nom}`);
    console.log("\n--- Totaux ---");
    console.log(`Dépenses totales: ${rapport.depensesTotal}`);
    console.log(`Paiements totaux: ${rapport.paiementsTotal}`);
    console.log(`Solde: ${rapport.solde}`);
    
    console.log("\n--- Dépenses par membre ---");
    rapport.depensesParMembre.forEach(item => {
        const membre = data.users.find(u => u.id === item.membreId);
        console.log(`${membre?.prenom} ${membre?.nom}: ${item.montant.toFixed(2)}`);
    });
    
    console.log("\n--- Paiements par membre ---");
    rapport.paiementsParMembre.forEach(item => {
        const membre = data.users.find(u => u.id === item.membreId);
        console.log(`${membre?.prenom} ${membre?.nom}: ${item.montant.toFixed(2)}`);
    });
}