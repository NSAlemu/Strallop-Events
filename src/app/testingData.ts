import {EventInterface, EventWebInterface} from "../Models/EventsModel.model";
import {EventStatusModel} from "../Models/EventStatus.model";
import {EmailModel} from "../Models/Email.model";


export function getEvents(): EventWebInterface[] {
  const eventArray: EventWebInterface[] = []
  const images = [
    {name: 'Massive Fridays at Trinity', image: 'https://images.unsplash.com/photo-1478147427282-58a87a120781?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZXZlbnRzfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'},
    {name: 'Seattle Tech Career Fair:Exclusive Tech Hiring Event-New Tickets Available', image: 'https://images.unsplash.com/photo-1556125574-d7f27ec36a06?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZXZlbnRzfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'},
    {name: 'SUNSET Boat Party', image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8ZXZlbnRzfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'},
    {name: 'Intro to Macro Photography - Online w/Sigma', image: 'https://images.unsplash.com/photo-1502635385003-ee1e6a1a742d?ixid=MnwxMjA3fDB8MHxzZWFyY2h8N3x8ZXZlbnRzfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'},
    {name: 'Reload Saturdays at Trinity', image: 'https://images.unsplash.com/photo-1549451371-64aa98a6f660?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8ZXZlbnRzfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'},
    {name: 'Washington Beer Fresh Hop Festival', image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8ZXZlbnRzfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'},
    {name: 'SOLD OUT - CATHEDRALS XXXIII: Josh Ritter (solo acoustic)', image: 'https://images.unsplash.com/photo-1587407627257-27b7127c868c?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fGV2ZW50c3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'},
    {name: 'Crystallography Gem + Mineral Market / LIFE:FORMS Festival Bellevue', image: 'https://images.unsplash.com/photo-1601601392622-5d18104a78fe?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjB8fGV2ZW50c3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'},
    {name: 'Noise Complaint ft. Doc Martin', image: 'https://images.unsplash.com/photo-1544926323-8463f67ecb5d?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjN8fGV2ZW50c3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'},
    {name: 'Seattle U Inauguration Mass and Inauguration Ceremony', image: 'https://images.unsplash.com/photo-1505714628981-7273be3e2bd7?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDB8fGV2ZW50c3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'},
    {name: 'How to buy a home in Las Vegas (Moving to Las Vegas from Seattle)', image: 'https://images.unsplash.com/photo-1625260868938-021a2e3a600b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MzV8fGV2ZW50c3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'},
    {name: 'Seattle Theatresports Improv LIVE!', image: 'https://images.unsplash.com/photo-1625062798671-a2b45295b6e7?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mzh8fGV2ZW50c3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'},
    {name: 'Seahawks Blue Friday Happy Hour', image: 'https://images.unsplash.com/photo-1510821733966-497ef399cacd?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDV8fGV2ZW50c3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'},
    {name: 'Seattle Job Fair - Seattle Career Fair', image: 'https://images.unsplash.com/photo-1521960695919-ffb6d7e2cad6?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NDF8fGV2ZW50c3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'},
    {name: 'CRUISIN\'W/Mediums Collective PT.2 - END OF SUMMER SPLASHFEST Cruise Party', image: 'https://images.unsplash.com/photo-1628436174535-19751abe2799?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NTd8fGV2ZW50c3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'},
    {name: 'West Seattle April Art Walk', image: 'https://images.unsplash.com/photo-1521960965075-ba9c5e4dce2e?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NjJ8fGV2ZW50c3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'},
    {name: 'Odd Plant Sale', image: 'https://images.unsplash.com/flagged/photo-1570183075251-42dfe72c138e?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NjF8fGV2ZW50c3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'},
    {name: 'the BREWERY COMEDY TOUR at CRUCIBLE', image: 'https://images.unsplash.com/photo-1597310619515-8c43d27cd711?ixid=MnwxMjA3fDB8MHxzZWFyY2h8OTd8fGV2ZW50c3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'},
    {name: 'DJ Prashant Presents Sunset Vibes: Latin-Bollywood Yacht Party in Seattle', image: 'https://images.unsplash.com/photo-1581351447001-ff198cbf3d5f?ixid=MnwxMjA3fDB8MHxzZWFyY2h8OTN8fGV2ZW50c3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'},
    {name: 'Christian French @ The Vera Project', image: 'https://images.unsplash.com/photo-1601404373265-25637630e00d?ixid=MnwxMjA3fDB8MHxzZWFyY2h8OTV8fGV2ZW50c3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'},
  ]
  for (let i = 0; i < 20; i++) {
    const event: EventWebInterface = {
      tickets: [],
      id: "a2snLoqmDA",
      name: "Addis Fashion Week",
      description: "",
      startDate: new Date("2021-09-12T21:00:00.000Z"),
      endDate: new Date("2021-09-13T00:00:00.000Z"),
      coverImage: 'null',
      address: {
        id: "uhtUup5xQu",
        name: "",
        address1: "",
        address2: "",
        city: "",
        country: "",
      }
    }
    event.name = images[i].name;
    event.coverImage = images[i].image
    eventArray.push(event);
  }
  return eventArray;
}
