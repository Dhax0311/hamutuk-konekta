/**
 * Timor-Leste Administrative Divisions & Reference Coordinates
 * Focused on Municipio Viqueque for the HAMUTUK 2.0 Disaster Coordination Project.
 */

// Viqueque Center & Zoom
export const VIQUEQUE_CENTER = [-8.8200, 126.4000];
export const VIQUEQUE_ZOOM = 10;
export const VIQUEQUE_BOUNDS = [
  [-8.6200, 126.0500], // Northwest corner (Lacluta/Ossu/Baucau border)
  [-9.0400, 126.8000]  // Southeast corner (Uatucarbau coast)
];

// Default map coordinates are locked to Viqueque
export const TIMOR_LESTE_CENTER = VIQUEQUE_CENTER;
export const DEFAULT_MAP_ZOOM = VIQUEQUE_ZOOM;

// The 5 Administrative Posts of Viqueque with their official Sucos & Aldeias
export const VIQUEQUE_POSTOS = [
  {
    name: 'Viqueque Vila',
    center: [-8.8575, 126.3647],
    sucos: [
      { name: 'Caraubalo', center: [-8.8650, 126.3620], aldeias: ['Cabira Oan', 'Lamaclar', 'Mane-Hat', 'Has Abut'] },
      { name: 'Uma Uain Craic', center: [-8.8780, 126.3750], aldeias: ['Naeboruc', 'Lugassa', 'Loho Oan'] },
      { name: 'Uma Quic', center: [-8.8510, 126.3700], aldeias: ['Bahabunao', 'Maca-Saer', 'Aisahe'] },
      { name: 'Bibileo', center: [-8.9120, 126.3310], aldeias: ['Balabac', 'Hare Oan', 'Mane-Hat'] },
      { name: 'Bahalarauain', center: [-8.8450, 126.3450], aldeias: ['Caninuc', 'Uma-Bo’o'] },
      { name: 'Luca', center: [-8.9350, 126.2480], aldeias: ['Canlor', 'Uma-Bo’o'] },
      { name: 'Maluru', center: [-8.8250, 126.3300], aldeias: ['Rade Uman', 'Boro-Mau'] },
      { name: 'Uai-Mori', center: [-8.7900, 126.3150], aldeias: ['Me-Amor', 'Koli-Oan'] }
    ]
  },
  {
    name: 'Ossu',
    center: [-8.7390, 126.3740],
    sucos: [
      { name: 'Ossu de Cima', center: [-8.7350, 126.3700], aldeias: ['Beloi', 'Boromau', 'Uma-Liurai'] },
      { name: 'Ossu de Baixo', center: [-8.7450, 126.3810], aldeias: ['Cai Ualo', 'Liamau'] },
      { name: 'Liaruca', center: [-8.7210, 126.3580], aldeias: ['Bahatata', 'Dilor-Oan', 'Selele'] },
      { name: 'Uabubo', center: [-8.7510, 126.3900], aldeias: ['Samaliurai', 'Uani-Uma'] },
      { name: 'Builale', center: [-8.7050, 126.3950], aldeias: ['Cai-Bua', 'Buanurac'] },
      { name: 'Nahareca', center: [-8.6850, 126.3650], aldeias: ['Nahareca Vila', 'Rinamau'] },
      { name: 'Loihuno', center: [-8.7850, 126.3850], aldeias: ['Loihuno Vila', 'Bua-Bae'] },
      { name: 'Uaguia', center: [-8.7150, 126.3300], aldeias: ['Dauloroc', 'Uaguia Vila'] }
    ]
  },
  {
    name: 'Uato-Lari',
    center: [-8.7610, 126.5490],
    sucos: [
      { name: 'Afaloicai', center: [-8.7420, 126.5350], aldeias: ['Afaloicai Vila', 'Samalari', 'Marae'] },
      { name: 'Babulo', center: [-8.7690, 126.5580], aldeias: ['Asumano', 'Borobai', 'Culu-Oan'] },
      { name: 'Macadique', center: [-8.7750, 126.5650], aldeias: ['Naha-Reka', 'Namanei', 'Bobo-Lau'] },
      { name: 'Matahoi', center: [-8.7550, 126.5410], aldeias: ['Baha-Neo', 'Doco-Soro'] },
      { name: 'Vessoru', center: [-8.8100, 126.5850], aldeias: ['Vessoru Vila', 'Bahabura'] },
      { name: 'Uaitame', center: [-8.7300, 126.5200], aldeias: ['Saebau', 'Uaitame Vila'] }
    ]
  },
  {
    name: 'Uatucarbau',
    center: [-8.7250, 126.6850],
    sucos: [
      { name: 'Irabin de Cima', center: [-8.7180, 126.6780], aldeias: ['Marae', 'Betu-Dilor', 'Buanurac'] },
      { name: 'Irabin de Baixo', center: [-8.7310, 126.6920], aldeias: ['Irabin Vila', 'Carau-Balo'] },
      { name: 'Afaloicai', center: [-8.7450, 126.6650], aldeias: ['Samalari', 'Nel-Ulo'] },
      { name: 'Bahatata', center: [-8.7050, 126.7100], aldeias: ['Bahatata Vila', 'Uani-Uma'] },
      { name: 'Loi Ulo', center: [-8.7350, 126.7250], aldeias: ['Loi Ulo Vila', 'Irabere'] },
      { name: 'Uani Uma', center: [-8.7550, 126.7050], aldeias: ['Uani Uma Vila', 'Boro-Oan'] }
    ]
  },
  {
    name: 'Lacluta',
    center: [-8.7900, 126.1400],
    sucos: [
      { name: 'Ahic', center: [-8.7850, 126.1350], aldeias: ['Ahic Vila', 'Borubau'] },
      { name: 'Dilor', center: [-8.8020, 126.1550], aldeias: ['Cai-Ualo', 'Dilor Vila', 'Rade-Oan'] },
      { name: 'Laline', center: [-8.7720, 126.1280], aldeias: ['Laline Vila', 'Santo Antonio'] },
      { name: 'Uma Tolu', center: [-8.8150, 126.1750], aldeias: ['Uma Tolu Vila', 'Craic'] }
    ]
  }
];

// Helper to retrieve all Sucos in Viqueque (flattened)
export const ALL_VIQUEQUE_SUCOS = VIQUEQUE_POSTOS.flatMap(p => 
  p.sucos.map(s => ({ ...s, posto: p.name }))
);

// Compatibility export
export const TIMOR_LESTE_MUNICIPALITIES = [
  {
    name: 'Viqueque',
    center: VIQUEQUE_CENTER,
    postos: VIQUEQUE_POSTOS
  }
];

/**
 * Fallback coordinate resolver for reports without direct GPS coordinates in Viqueque.
 */
export function getAdministrativeFallbackLocation(municipalityName, postoName, sucoName) {
  const defaultLocation = {
    coordinates: VIQUEQUE_CENTER,
    isApproximate: true,
    precisionLevel: 'municipality',
    label: 'Viqueque Sentrál [Municipality Centroid - Approximate]'
  };

  if (!postoName && !sucoName) {
    return defaultLocation;
  }

  // Find Posto in Viqueque
  if (postoName) {
    const posto = VIQUEQUE_POSTOS.find(
      p => p.name.toLowerCase() === postoName.toLowerCase() ||
           postoName.toLowerCase().includes(p.name.toLowerCase()) ||
           p.name.toLowerCase().includes(postoName.toLowerCase())
    );

    if (posto) {
      if (sucoName) {
        const suco = posto.sucos.find(
          s => s.name.toLowerCase() === sucoName.toLowerCase() ||
               sucoName.toLowerCase().includes(s.name.toLowerCase()) ||
               s.name.toLowerCase().includes(sucoName.toLowerCase())
        );
        if (suco) {
          return {
            coordinates: suco.center,
            isApproximate: true,
            precisionLevel: 'suco',
            label: `${suco.name}, ${posto.name}, Viqueque [Suco Centroid - Approximate]`
          };
        }
      }
      return {
        coordinates: posto.center,
        isApproximate: true,
        precisionLevel: 'posto',
        label: `${posto.name}, Viqueque [Posto Centroid - Approximate]`
      };
    }
  }

  // If only Suco is known, search across all postos
  if (sucoName) {
    for (const p of VIQUEQUE_POSTOS) {
      const suco = p.sucos.find(s => s.name.toLowerCase() === sucoName.toLowerCase());
      if (suco) {
        return {
          coordinates: suco.center,
          isApproximate: true,
          precisionLevel: 'suco',
          label: `${suco.name}, ${p.name}, Viqueque [Suco Centroid - Approximate]`
        };
      }
    }
  }

  return defaultLocation;
}
