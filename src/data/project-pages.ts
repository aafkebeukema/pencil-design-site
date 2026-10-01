export type ProjectImage = {
  src: string;
  alt: string;
  category: 'kitchens' | 'other';
};

export type ProjectPage = {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  intro: string;
  scope: string[];
  images: ProjectImage[];
};

export const projectPages: ProjectPage[] = [
  {
    slug: 'dulwich-hill',
    title: 'Dulwich Hill',
    metaTitle: 'Dulwich Hill Kitchen Installation | Pencil Design',
    description: 'Explore a bespoke fitted kitchen project in Dulwich Hill, South East London, completed by Pencil Design.',
    intro: 'A fitted kitchen project in Dulwich Hill, bringing together tailored cabinetry and carefully resolved installation details.',
    scope: ['Kitchen installation', 'Fitted cabinetry', 'Finishing details'],
    images: [
      { src: '/images/kitchen-dulwich-hill-01.jpg', alt: 'Bespoke fitted kitchen, Dulwich Hill, South East London', category: 'kitchens' },
      { src: '/images/kitchen-dulwich-hill-02.jpg', alt: 'Fitted kitchen detail, Dulwich Hill, South East London', category: 'kitchens' },
    ],
  },
  {
    slug: 'hackney-road',
    title: 'Hackney Road',
    metaTitle: 'Hackney Road Kitchen & Bathroom Project | Pencil Design',
    description: 'See Pencil Design’s Hackney Road kitchen and bathroom project, including fitted cabinetry and bespoke joinery.',
    intro: 'A comprehensive kitchen and bathroom project on Hackney Road, combining fitted cabinetry, custom joinery and carefully finished details.',
    scope: ['Kitchen installation', 'Custom joinery and cabinetry', 'Bathroom fitting'],
    images: [
      { src: '/images/kitchen-hackney-road-01.jpg', alt: 'Bespoke fitted kitchen with custom joinery, Hackney Road', category: 'kitchens' },
      { src: '/images/kitchen-hackney-road-02.jpg', alt: 'Custom joinery kitchen, Hackney Road', category: 'kitchens' },
      { src: '/images/kitchen-hackney-road-03.jpg', alt: 'Fitted kitchen with custom joinery detail, Hackney Road', category: 'kitchens' },
      { src: '/images/kitchen-hackney-road-04.jpg', alt: 'Bespoke kitchen cabinetry, Hackney Road', category: 'kitchens' },
      { src: '/images/kitchen-hackney-road-05.jpg', alt: 'Custom fitted kitchen, Hackney Road', category: 'kitchens' },
      { src: '/images/kitchen-hackney-road-06.jpg', alt: 'Kitchen joinery and cabinetry, Hackney Road', category: 'kitchens' },
      { src: '/images/kitchen-hackney-road-07.jpg', alt: 'Bespoke kitchen construction, Hackney Road', category: 'kitchens' },
      { src: '/images/kitchen-hackney-road-08.jpg', alt: 'Custom kitchen with integrated joinery, Hackney Road', category: 'kitchens' },
      { src: '/images/kitchen-hackney-road-09-3.jpg', alt: 'Fitted kitchen with custom joinery, Hackney Road', category: 'kitchens' },
      { src: '/images/hackney-road-bathroom-built-01.jpg', alt: 'Bespoke fitted bathroom, Hackney Road', category: 'other' },
      { src: '/images/hackney-road-bathroom-built-02.jpg', alt: 'Custom bathroom detail, Hackney Road', category: 'other' },
    ],
  },
  {
    slug: 'lordship-lane',
    title: 'Lordship Lane',
    metaTitle: 'Lordship Lane Home Renovation | Pencil Design',
    description: 'Explore a Lordship Lane renovation spanning kitchen installation, living spaces, flooring and fitted joinery.',
    intro: 'A home renovation on Lordship Lane spanning the kitchen and living spaces, with fitted joinery, flooring and carefully completed finishes.',
    scope: ['Home renovation', 'Kitchen installation', 'Living-room joinery and flooring'],
    images: [
      { src: '/images/lordship-lane-built-01.jpg', alt: 'Full house renovation, lounge and living room, Lordship Lane', category: 'other' },
      { src: '/images/lordship-lane-built-02.jpg', alt: 'Renovated living room with new flooring and decoration, Lordship Lane', category: 'other' },
      { src: '/images/lordship-lane-built-03.jpg', alt: 'House renovation, painted lounge with new flooring, Lordship Lane', category: 'other' },
      { src: '/images/kitchen-lordship-04.jpg', alt: 'Bespoke fitted kitchen, Lordship Lane', category: 'kitchens' },
      { src: '/images/kitchen-lordship-01.jpg', alt: 'Custom fitted kitchen detail, Lordship Lane', category: 'kitchens' },
      { src: '/images/lordship-lane-lounge-built-01.jpg', alt: 'Finished lounge with built-in alcove shelving and cupboards, Lordship Lane', category: 'other' },
    ],
  },
  {
    slug: 'napier-road',
    title: 'Napier Road',
    metaTitle: 'Napier Road Timber Gate Project | Pencil Design',
    description: 'View a custom timber front garden fence and gate project on Napier Road by Pencil Design.',
    intro: 'A custom timber front garden fence and gate designed to create a practical, carefully finished entrance on Napier Road.',
    scope: ['Custom timber work', 'Front garden fence', 'Entrance gate'],
    images: [
      { src: '/images/napier-road-built-01.jpg', alt: 'Custom timber front garden fence and gate, Napier Road', category: 'other' },
    ],
  },
  {
    slug: 'paddock-close',
    title: 'Paddock Close',
    metaTitle: 'Paddock Close Kitchen & Bathroom Project | Pencil Design',
    description: 'See a Paddock Close residential project including kitchen, bathroom, shower and bespoke staircase work.',
    intro: 'A multi-space residential project at Paddock Close, covering kitchen, bathroom, shower and staircase work with bespoke detailing throughout.',
    scope: ['Kitchen installation', 'Bathroom and shower fitting', 'Tiling, copper details and timber staircase work'],
    images: [
      { src: '/images/paddock-close-bathroom-built-01.jpg', alt: 'Custom bathroom with bespoke tiling and copper welded pipework, Paddock Close', category: 'other' },
      { src: '/images/paddock-close-bathroom-built-02.jpg', alt: 'Bespoke bathroom with custom copper pipework and shower, Paddock Close', category: 'other' },
      { src: '/images/paddock-close-bathroom-built-03.jpg', alt: 'Custom designed bathroom with copper welded taps and fittings, Paddock Close', category: 'other' },
      { src: '/images/paddock-close-bathroom-built-04.jpg', alt: 'Bespoke tiling and copper pipework bathroom detail, Paddock Close', category: 'other' },
      { src: '/images/paddock-close-bathroom-built-05.jpg', alt: 'Custom bathroom construction with bespoke copper fittings, Paddock Close', category: 'other' },
      { src: '/images/kitchen-paddock-01.jpg', alt: 'Custom fitted kitchen, Paddock Close', category: 'kitchens' },
      { src: '/images/kitchen-paddock-02.jpg', alt: 'Bespoke fitted kitchen detail, Paddock Close', category: 'kitchens' },
      { src: '/images/paddock-close-shower-crafted-01.jpg', alt: 'Custom crafted shower with bespoke tiling and copper pipework, Paddock Close', category: 'other' },
      { src: '/images/paddock-close-stairs-built-01.jpg', alt: 'Custom timber staircase, Paddock Close', category: 'other' },
      { src: '/images/paddock-close-stairs-built-02.jpg', alt: 'Bespoke timber staircase detail, Paddock Close', category: 'other' },
    ],
  },
  {
    slug: 'queensville-road',
    title: 'Queensville Road',
    metaTitle: 'Queensville Road Kitchen Renovation | Pencil Design',
    description: 'Explore a Queensville Road kitchen and home renovation featuring custom joinery by Pencil Design.',
    intro: 'A kitchen and home renovation on Queensville Road, completed with custom joinery and carefully considered fitting details.',
    scope: ['Kitchen installation', 'Custom joinery', 'Home renovation'],
    images: [
      { src: '/images/kitchen-queensville-road-03.jpg', alt: 'Completed house renovation and custom joinery, Queensville Road', category: 'kitchens' },
      { src: '/images/kitchen-queensville-road-02.jpg', alt: 'House renovation with bespoke joinery detail, Queensville Road', category: 'kitchens' },
      { src: '/images/kitchen-queensville-road-01.jpg', alt: 'Full house renovation with custom joinery, Queensville Road', category: 'kitchens' },
    ],
  },
  {
    slug: 'reigate-road-workshop',
    title: 'Reigate Road Workshop',
    metaTitle: 'Reigate Road Workshop Project | Pencil Design',
    description: 'View Pencil Design’s completed workshop project on Reigate Road.',
    intro: 'A completed workshop project on Reigate Road, delivered with a focus on practical use and careful finishing.',
    scope: ['Workshop project', 'Practical fit-out', 'Finishing work'],
    images: [
      { src: '/images/reigate-road-workshop-built-01.jpg', alt: 'Completed workshop project, Reigate Road', category: 'other' },
    ],
  },
];
