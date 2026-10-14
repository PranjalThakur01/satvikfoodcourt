import { PageIntro } from "@/components/PageIntro";
import { MenuExperience } from "@/components/MenuExperience";

export const metadata = { title: "Menu | Satvik Food Court", description: "Explore momos, pizza, street food, waffles, bubble tea and vegetarian favourites at Satvik Food Court." };

export default function MenuPage() {
  return <><PageIntro eyebrow="A little something for every appetite" title={<>Good things<br /><em>on the menu.</em></>} copy="Go on, find your favourite. Everything here is made to be enjoyed." /><MenuExperience /></>;
}
