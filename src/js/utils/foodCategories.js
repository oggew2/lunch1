// Enhanced food categorization with comprehensive coverage
export function detectFoodCategory(text) {
    const lower = text.toLowerCase();
    
    // Skip generic descriptions
    if (/kitchen chooses|extra dish|onion ring|french fries|pommes|tillbehör/.test(lower)) return null;
    
    // EXPLICIT vegan/vegetarian labels (highest priority)
    if (/\bvegan\b|vegetarisk|vegetarian/.test(lower)) return '🌱 Vegetarian';
    
    // Desserts - sweet items only
    if (/mjukglass|glass med|pannkakor med sylt|pannkakor med grädde|dessert|crumble|cake|tart|cheesecake|tiramisu|mousse|sorbet|gelato|ice cream|chocolate|brownie/.test(lower)) return '🍰 Dessert';
    
    // Fish - comprehensive including Swedish terms
    if (/\bfish\b|salmon|cod|tuna|seafood|shrimp|prawn|saithe|herring|plaice|haddock|halibut|sole|flounder|perch|trout|mackerel|anchov|lax|sej|torsk|kolja|rödspätta|strömming|sill|räk|fisk|kapkummel|pocherad.*filé|tandoori.*lax|rimmad.*torsk/.test(lower)) return '🐟 Fish';
    
    // Meat - extensive list including Swedish and cooking methods
    if (/ground beef|beef|pork|lamb|veal|chicken|turkey|duck|bacon|ham|sausage|korv|meatball|köttbull|biff|schnitzel|cabbage roll|kåldolm|pulled pork|fläsk|kalv|oxkött|kyckling|nöt|kött|fajita|gyros|pannbiff|kabanoss|chorizo|tri tip|högrev|rapsgris|kotlettrad|gödkalv|creole.*chicken|lemon chicken|cajun.*pork|whole roasted pork|slow-baked pork|baked chicken|chili con carne|truffle pasta.*bacon/.test(lower)) return '🍖 Meat';
    
    // Vegetarian - comprehensive plant-based ingredients
    if (/halloumi|haloumi|veggie|tofu|tempeh|falafel|quorn|chickpea|lentil|bean.*patty|cauliflower|zucchini|eggplant|aubergine|soja|linser|ädelost.*paj|broccoli.*paj|sötpotatis.*feta|patties.*vegetarian|patties.*sun.*dried|corn.*pancake|leek.*pancake|spinach|ricotta|cannelloni|pasta.*mushroom|spaghetti.*mushroom|risotto.*mushroom|nacho.*vegetarian|springroll.*vegetarian|mac.*cheese|chili sin carne|soy mince|veggie bites|bell pepper filled.*beans|pie.*leek.*cheese|beet.*root.*patties|artichoke au gratin|bean.*cheese stroganoff|tortellini.*ricotta|blomkålscurry|paneer|auberginegryta.*sojafärs|nacho pizza.*vegan mince|noodle wok.*veggie bites|vegetarisk pizza/.test(lower)) return '🌱 Vegetarian';
    
    return null;
}
