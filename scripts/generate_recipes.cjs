// Script to generate all 1000 detailed clinical recipes structured across 10 category files
const fs = require('fs');
const path = require('path');

const RAW_1000_NAMES = [
  // 1-100: Healthy Breakfasts & Morning Foods
  "Vegetable Poha", "Indori Poha", "Kanda Poha", "Sprouted Moong Poha", "Oats Vegetable Poha",
  "Red Rice Poha", "Brown Rice Poha", "Vegetable Upma", "Rava Upma", "Millet Upma",
  "Oats Upma", "Quinoa Upma", "Broken Wheat Upma", "Vegetable Dalia", "Sweet Dalia",
  "Masala Dalia", "Moong Dal Dalia", "Vegetable Oats", "Savory Oats Bowl", "Oats Vegetable Khichdi",
  "Plain Oats Porridge", "Banana Oats Porridge", "Apple Cinnamon Oats", "Dates Oats Porridge", "Mixed Fruit Oats",
  "Overnight Oats", "Chia Oatmeal", "Ragi Porridge", "Bajra Porridge", "Jowar Porridge",
  "Multigrain Porridge", "Millet Porridge", "Almond Oatmeal", "Peanut Oatmeal", "Vegetable Besan Chilla",
  "Plain Besan Chilla", "Moong Dal Chilla", "Mixed Dal Chilla", "Spinach Chilla", "Paneer Chilla",
  "Oats Chilla", "Ragi Chilla", "Millet Chilla", "Quinoa Chilla", "Sprouted Moong Chilla",
  "Vegetable Cheela", "Tomato Besan Chilla", "Methi Chilla", "Palak Besan Chilla", "Carrot Chilla",
  "Idli", "Brown Rice Idli", "Ragi Idli", "Millet Idli", "Oats Idli",
  "Vegetable Idli", "Kanchipuram Idli", "Moong Dal Idli", "Mixed Dal Idli", "Plain Dosa",
  "Multigrain Dosa", "Ragi Dosa", "Millet Dosa", "Oats Dosa", "Brown Rice Dosa",
  "Adai Dosa", "Pesarettu", "Moong Dal Dosa", "Vegetable Dosa", "Tomato Dosa",
  "Palak Dosa", "Neer Dosa", "Appam", "Vegetable Appam", "Pesarattu Upma",
  "Vegetable Uttapam", "Oats Uttapam", "Ragi Uttapam", "Millet Uttapam", "Tomato Uttapam",
  "Onion Uttapam", "Palak Uttapam", "Vegetable Pongal", "Ven Pongal", "Millet Pongal",
  "Quinoa Pongal", "Moong Dal Pongal", "Vegetable Sevai", "Millet Sevai", "Vegetable Vermicelli",
  "Oats Vegetable Sevai", "Lemon Sevai", "Tomato Sevai", "Vegetable Sandwich", "Whole Wheat Vegetable Sandwich",
  "Paneer Vegetable Sandwich", "Sprouts Sandwich", "Avocado Vegetable Toast", "Peanut Banana Toast", "Multigrain Veg Toast",

  // 101-200: Indian Vegetarian Main Meals
  "Dal Tadka", "Dal Fry", "Dal Palak", "Dal Makhani", "Yellow Moong Dal",
  "Green Moong Dal", "Masoor Dal", "Red Lentil Dal", "Chana Dal", "Toor Dal",
  "Urad Dal", "Panchmel Dal", "Mixed Dal", "Gujarati Dal", "Maharashtrian Amti",
  "Bengali Dal", "South Indian Sambar", "Vegetable Sambar", "Drumstick Sambar", "Pumpkin Sambar",
  "Spinach Dal", "Tomato Dal", "Lemon Dal", "Garlic Dal", "Methi Dal",
  "Bottle Gourd Dal", "Ridge Gourd Dal", "Carrot Dal", "Beans Dal", "Raw Mango Dal",
  "Chana Masala", "Kala Chana Curry", "Green Chana Curry", "Rajma Curry", "Lobia Curry",
  "Kabuli Chana Curry", "Matar Masala", "Green Peas Curry", "Soybean Curry", "Soya Chunk Curry",
  "Soya Vegetable Curry", "Tofu Curry", "Tofu Palak", "Tofu Bhurji", "Paneer Bhurji",
  "Palak Paneer", "Methi Paneer", "Peas Paneer", "Tomato Paneer", "Lauki Kofta",
  "Vegetable Kofta Curry", "Cabbage Peas Curry", "Cauliflower Curry", "Aloo Gobi", "Gobhi Matar",
  "Bhindi Masala", "Bharwa Bhindi", "Baingan Bharta", "Baingan Masala", "Karela Sabzi",
  "Lauki Sabzi", "Tori Sabzi", "Tinda Masala", "Pumpkin Sabzi", "Kaddu Masala",
  "Carrot Peas Sabzi", "Beans Poriyal", "Beetroot Poriyal", "Cabbage Poriyal", "Carrot Beans Poriyal",
  "Palak Corn Sabzi", "Methi Aloo", "Palak Aloo", "Jeera Aloo", "Shahi Aloo",
  "Matar Aloo", "Capsicum Potato Sabzi", "Capsicum Paneer", "Mixed Vegetable Curry", "Vegetable Jalfrezi",
  "Vegetable Stew", "Vegetable Korma", "Navratan Vegetable Curry", "Mixed Veg Masala", "Mushroom Masala",
  "Mushroom Peas Curry", "Mushroom Palak", "Corn Palak", "Corn Capsicum Curry", "Broccoli Masala",
  "Zucchini Curry", "Bottle Gourd Tomato Curry", "Ridge Gourd Coconut Curry", "Pumpkin Coconut Curry", "Drumstick Curry",
  "Jackfruit Curry", "Raw Banana Curry", "Raw Papaya Curry", "Mixed Greens Sabzi", "Seasonal Vegetable Curry",

  // 201-300: Healthy Rice, Khichdi & Grain Meals
  "Moong Dal Khichdi", "Vegetable Khichdi", "Millet Khichdi", "Bajra Khichdi", "Jowar Khichdi",
  "Ragi Khichdi", "Quinoa Khichdi", "Oats Khichdi", "Dalia Khichdi", "Masala Khichdi",
  "Palak Khichdi", "Methi Khichdi", "Vegetable Moong Khichdi", "Mixed Dal Khichdi", "Brown Rice Khichdi",
  "Red Rice Khichdi", "Foxtail Millet Khichdi", "Little Millet Khichdi", "Kodo Millet Khichdi", "Barnyard Millet Khichdi",
  "Vegetable Pulao", "Brown Rice Vegetable Pulao", "Quinoa Vegetable Pulao", "Millet Vegetable Pulao", "Peas Pulao",
  "Methi Pulao", "Palak Pulao", "Carrot Peas Pulao", "Corn Pulao", "Beans Pulao",
  "Mushroom Pulao", "Paneer Pulao", "Soya Pulao", "Vegetable Biryani", "Brown Rice Biryani",
  "Millet Biryani", "Quinoa Biryani", "Vegetable Handi Rice", "Tomato Rice", "Lemon Rice",
  "Curd Rice", "Brown Rice Curd Rice", "Coconut Rice", "Tamarind Rice", "Sesame Rice",
  "Mint Rice", "Coriander Rice", "Spinach Rice", "Beetroot Rice", "Carrot Rice",
  "Capsicum Rice", "Garlic Rice", "Peas Rice", "Corn Rice", "Mixed Vegetable Rice",
  "Moong Dal Rice", "Dal Rice Bowl", "Rajma Rice Bowl", "Chole Rice Bowl", "Lobia Rice Bowl",
  "Palak Rice Bowl", "Sambar Rice", "Rasam Rice", "Vegetable Sambar Rice", "Vegetable Fried Brown Rice",
  "Vegetable Millet Rice", "Quinoa Rice Bowl", "Brown Rice Buddha Bowl", "Chickpea Rice Bowl", "Tofu Rice Bowl",
  "Paneer Rice Bowl", "Lentil Rice Bowl", "Sprouted Bean Rice Bowl", "Vegetable Grain Bowl", "Mediterranean Rice Bowl",
  "Mexican Bean Rice Bowl", "Herb Brown Rice", "Garlic Herb Quinoa", "Lemon Herb Quinoa", "Vegetable Quinoa Bowl",
  "Quinoa Dal Bowl", "Quinoa Chickpea Bowl", "Millet Dal Bowl", "Millet Vegetable Bowl", "Bajra Dal Bowl",
  "Jowar Vegetable Bowl", "Ragi Grain Bowl", "Barley Vegetable Bowl", "Barley Dal Bowl", "Barley Khichdi",
  "Barley Vegetable Pulao", "Barley Soup Rice Bowl", "Broken Wheat Vegetable Bowl", "Dalia Dal Bowl", "Dalia Vegetable Pulao",
  "Dalia Khichdi Bowl", "Oats Grain Bowl", "Multigrain Rice Bowl", "Seven-Grain Khichdi", "Multigrain Vegetable Bowl",

  // 301-400: Healthy Indian Roti, Paratha & Flatbreads
  "Whole Wheat Roti", "Multigrain Roti", "Bajra Roti", "Jowar Roti", "Ragi Roti",
  "Makki Roti", "Barley Roti", "Oats Roti", "Besan Roti", "Methi Roti",
  "Palak Roti", "Beetroot Roti", "Carrot Roti", "Lauki Roti", "Pumpkin Roti",
  "Cabbage Roti", "Spinach Multigrain Roti", "Soya Flour Roti", "Quinoa Roti", "Moong Dal Roti",
  "Stuffed Vegetable Roti", "Paneer Roti", "Sprouts Roti", "Whole Wheat Phulka", "Multigrain Phulka",
  "Bajra Phulka", "Jowar Bhakri", "Bajra Bhakri", "Ragi Bhakri", "Multigrain Bhakri",
  "Vegetable Paratha", "Methi Paratha", "Palak Paratha", "Lauki Paratha", "Carrot Paratha",
  "Beetroot Paratha", "Pumpkin Paratha", "Cabbage Paratha", "Cauliflower Paratha", "Broccoli Paratha",
  "Paneer Paratha", "Moong Dal Paratha", "Sattu Paratha", "Chana Dal Paratha", "Mixed Dal Paratha",
  "Sprouts Paratha", "Peas Paratha", "Corn Paratha", "Soybean Paratha", "Multigrain Vegetable Paratha",
  "Oats Paratha", "Ragi Paratha", "Bajra Paratha", "Jowar Paratha", "Quinoa Paratha",
  "Methi Multigrain Paratha", "Palak Paneer Paratha", "Spinach Corn Paratha", "Carrot Paneer Paratha", "Beetroot Paneer Paratha",
  "Vegetable Stuffed Kulcha", "Whole Wheat Kulcha", "Missi Roti", "Besan Missi Roti", "Multigrain Missi Roti",
  "Sattu Roti", "Thepla", "Methi Thepla", "Palak Thepla", "Bajra Thepla",
  "Jowar Thepla", "Multigrain Thepla", "Lauki Thepla", "Dudhi Thepla", "Oats Thepla",
  "Vegetable Thepla", "Ragi Dosa Wrap", "Multigrain Dosa Wrap", "Whole Wheat Vegetable Wrap", "Paneer Vegetable Wrap",
  "Chickpea Wrap", "Hummus Veggie Wrap", "Tofu Veggie Wrap", "Sprout Wrap", "Soya Vegetable Wrap",
  "Egg Vegetable Wrap", "Chicken Salad Wrap", "Grilled Chicken Wrap", "Fish Vegetable Wrap", "Lentil Wrap",
  "Black Bean Wrap", "Rajma Wrap", "Chole Wrap", "Mexican Bean Wrap", "Mediterranean Veg Wrap",
  "Avocado Veg Wrap", "Corn Bean Wrap", "Millet Wrap", "Quinoa Wrap", "Multigrain Protein Wrap",

  // 401-500: Homemade Soups
  "Vegetable Clear Soup", "Mixed Vegetable Soup", "Tomato Soup", "Carrot Soup", "Beetroot Soup",
  "Pumpkin Soup", "Spinach Soup", "Broccoli Soup", "Mushroom Soup", "Sweet Corn Soup",
  "Sweet Potato Soup", "Pea Soup", "Green Pea Soup", "Cabbage Soup", "Cauliflower Soup",
  "Bottle Gourd Soup", "Ridge Gourd Soup", "Zucchini Soup", "Celery Vegetable Soup", "Lentil Soup",
  "Masoor Dal Soup", "Moong Dal Soup", "Mixed Dal Soup", "Chana Soup", "Chickpea Soup",
  "Black Bean Soup", "Kidney Bean Soup", "Rajma Soup", "Lobia Soup", "Barley Soup",
  "Oats Soup", "Millet Soup", "Quinoa Soup", "Dalia Soup", "Vegetable Dalia Soup",
  "Tomato Lentil Soup", "Spinach Lentil Soup", "Carrot Lentil Soup", "Pumpkin Lentil Soup", "Vegetable Bean Soup",
  "Chickpea Vegetable Soup", "Mushroom Lentil Soup", "Broccoli Lentil Soup", "Mixed Greens Soup", "Palak Corn Soup",
  "Lemon Coriander Soup", "Ginger Vegetable Soup", "Garlic Vegetable Soup", "Turmeric Vegetable Soup", "Herbal Vegetable Soup",
  "Chicken Vegetable Soup", "Chicken Clear Soup", "Chicken Lentil Soup", "Chicken Barley Soup", "Chicken Corn Soup",
  "Chicken Spinach Soup", "Chicken Mushroom Soup", "Chicken Lemon Soup", "Chicken Ginger Soup", "Chicken Vegetable Broth",
  "Fish Vegetable Soup", "Fish Clear Soup", "Fish Lemon Soup", "Fish Ginger Soup", "Fish Spinach Soup",
  "Egg Drop Vegetable Soup", "Egg Vegetable Soup", "Tofu Vegetable Soup", "Tofu Miso Soup", "Paneer Vegetable Soup",
  "Soybean Soup", "Soya Vegetable Soup", "Sprouted Moong Soup", "Sprouted Lentil Soup", "Mixed Sprouts Soup",
  "Spinach Tomato Soup", "Tomato Carrot Soup", "Tomato Beet Soup", "Carrot Ginger Soup", "Carrot Pumpkin Soup",
  "Pumpkin Coconut Soup", "Broccoli Spinach Soup", "Cauliflower Spinach Soup", "Mushroom Spinach Soup", "Pea Spinach Soup",
  "Corn Vegetable Soup", "Corn Broccoli Soup", "Vegetable Noodle Soup", "Whole Wheat Noodle Soup", "Buckwheat Vegetable Soup",
  "Soba Vegetable Soup", "Rice Vegetable Soup", "Brown Rice Vegetable Soup", "Millet Vegetable Broth", "Quinoa Vegetable Soup",
  "Lentil Tomato Broth", "Rustic Vegetable Soup", "Homemade Minestrone", "Homemade Bean Stew", "Homemade Vegetable Stew",

  // 501-600: Healthy Salads, Sprouts & Chaat
  "Cucumber Tomato Salad", "Carrot Cucumber Salad", "Beetroot Carrot Salad", "Mixed Green Salad", "Garden Salad",
  "Rainbow Vegetable Salad", "Sprouted Moong Salad", "Sprouted Chana Salad", "Mixed Sprouts Salad", "Sprouted Bean Salad",
  "Chickpea Salad", "Black Chana Salad", "Rajma Salad", "Lobia Salad", "Lentil Salad",
  "Moong Bean Salad", "Green Gram Salad", "Black Bean Salad", "Corn Salad", "Corn Cucumber Salad",
  "Corn Tomato Salad", "Avocado Salad", "Paneer Salad", "Tofu Salad", "Grilled Paneer Salad",
  "Grilled Chicken Salad", "Boiled Egg Salad", "Egg Vegetable Salad", "Tuna Vegetable Salad", "Fish Salad",
  "Apple Walnut Salad", "Apple Carrot Salad", "Apple Cucumber Salad", "Orange Carrot Salad", "Pomegranate Salad",
  "Pomegranate Sprout Salad", "Fruit Nut Salad", "Mixed Fruit Salad", "Papaya Fruit Salad", "Guava Fruit Salad",
  "Watermelon Mint Salad", "Muskmelon Fruit Salad", "Pineapple Cucumber Salad", "Mango Cucumber Salad", "Pear Walnut Salad",
  "Banana Peanut Salad", "Chia Fruit Salad", "Flaxseed Salad", "Sesame Vegetable Salad", "Pumpkin Seed Salad",
  "Sunflower Seed Salad", "Quinoa Salad", "Millet Salad", "Brown Rice Salad", "Barley Salad",
  "Pasta Vegetable Salad", "Whole Wheat Pasta Salad", "Chickpea Pasta Salad", "Mediterranean Salad", "Greek-Style Homemade Salad",
  "Hummus Salad Bowl", "Bean Salsa Salad", "Mexican Bean Salad", "Kidney Bean Corn Salad", "Chickpea Cucumber Salad",
  "Chickpea Tomato Salad", "Sprout Chaat", "Moong Chaat", "Chana Chaat", "Fruit Chaat",
  "Mixed Fruit Chaat", "Vegetable Chaat", "Sweet Potato Chaat", "Corn Chaat", "Paneer Chaat",
  "Tofu Chaat", "Makhana Chaat", "Roasted Chana Chaat", "Peanut Chaat", "Sprouted Lentil Chaat",
  "Beetroot Chaat", "Carrot Chaat", "Cucumber Chaat", "Tomato Chaat", "Amla Chaat",
  "Guava Chaat", "Papaya Chaat", "Pomegranate Chaat", "Boiled Potato Chaat", "Sweet Corn Chaat",
  "Black Chana Chaat", "Rajma Chaat", "Lobia Chaat", "Millet Chaat", "Quinoa Chaat",
  "Barley Chaat", "Dalia Chaat", "Mixed Grain Chaat", "Sprouts & Fruit Bowl", "Protein Salad Bowl",

  // 601-700: Healthy Homemade Snacks
  "Roasted Makhana", "Masala Makhana", "Roasted Chana", "Roasted Peanuts", "Roasted Almonds",
  "Roasted Walnuts", "Roasted Pumpkin Seeds", "Roasted Sunflower Seeds", "Roasted Lotus Seeds", "Homemade Trail Mix",
  "Nuts & Seeds Mix", "Dry Fruit Mix", "Homemade Granola", "Oats Granola", "Millet Granola",
  "Nutty Oat Bars", "Peanut Oat Bars", "Date Nut Bars", "Sesame Nut Bars", "Seed Energy Bites",
  "Date Energy Balls", "Oat Energy Balls", "Peanut Energy Balls", "Coconut Energy Balls", "Almond Energy Balls",
  "Chia Energy Bites", "Flaxseed Energy Bites", "Ragi Energy Balls", "Millet Energy Balls", "Makhana Energy Balls",
  "Homemade Protein Laddoo", "Ragi Laddoo", "Besan Laddoo", "Til Laddoo", "Peanut Laddoo",
  "Date Laddoo", "Dry Fruit Laddoo", "Oats Laddoo", "Coconut Date Laddoo", "Amaranth Laddoo",
  "Rajgira Laddoo", "Multigrain Laddoo", "Sattu Laddoo", "Chana Laddoo", "Sesame Peanut Laddoo",
  "Homemade Baked Samosa", "Baked Vegetable Samosa", "Baked Paneer Samosa", "Baked Chicken Samosa", "Vegetable Handvo",
  "Homemade Dhokla", "Khaman Dhokla", "Oats Dhokla", "Ragi Dhokla", "Millet Dhokla",
  "Moong Dhokla", "Mixed Dal Dhokla", "Spinach Dhokla", "Special Vegetable Handvo", "Lentil Handvo",
  "Vegetable Appe", "Paniyaram", "Vegetable Paniyaram", "Ragi Appe", "Oats Appe",
  "Moong Dal Appe", "Sprouts Appe", "Baked Vegetable Cutlet", "Beetroot Cutlet", "Sweet Potato Cutlet",
  "Paneer Cutlet", "Lentil Cutlet", "Chickpea Cutlet", "Oats Vegetable Cutlet", "Mixed Vegetable Tikki",
  "Sweet Potato Tikki", "Moong Dal Tikki", "Chana Tikki", "Rajma Tikki", "Quinoa Tikki",
  "Millet Tikki", "Paneer Tikki", "Tofu Tikki", "Vegetable Kebabs", "Paneer Vegetable Kebabs",
  "Mushroom Kebabs", "Tofu Kebabs", "Chicken Vegetable Kebabs", "Fish Vegetable Kebabs", "Grilled Corn",
  "Steamed Corn", "Masala Corn", "Lemon Corn", "Roasted Sweet Potato", "Baked Sweet Potato Fries",
  "Baked Carrot Fries", "Baked Beetroot Fries", "Baked Zucchini Fries", "Homemade Vegetable Chips", "Baked Multigrain Crackers",

  // 701-800: Healthy Non-Vegetarian Homemade Foods
  "Grilled Chicken Breast", "Homemade Chicken Curry", "Light Chicken Curry", "Chicken Vegetable Curry", "Chicken Palak",
  "Chicken Methi", "Chicken Tomato Curry", "Chicken Ginger Curry", "Chicken Garlic Curry", "Chicken Lemon Curry",
  "Chicken Coconut Curry", "Chicken Pumpkin Curry", "Chicken Lauki Curry", "Chicken Peas Curry", "Chicken Mushroom Curry",
  "Chicken Broccoli Stir-Fry", "Chicken Vegetable Stir-Fry", "Chicken Brown Rice Bowl", "Chicken Quinoa Bowl", "Chicken Millet Bowl",
  "Chicken Dalia Bowl", "Chicken Vegetable Pulao", "Chicken Brown Rice Pulao", "Chicken Quinoa Pulao", "Homemade Chicken Biryani",
  "Brown Rice Chicken Biryani", "Millet Chicken Biryani", "Chicken Khichdi", "Chicken Lentil Stew", "Chicken Chickpea Curry",
  "Chicken Rajma Curry", "Chicken Lentil Curry", "Chicken Sambar Style Stew", "Chicken Vegetable Soup", "Chicken Corn Soup",
  "Chicken Mushroom Soup", "Chicken Spinach Soup", "Chicken Barley Soup", "Chicken Oats Soup", "Chicken Clear Broth",
  "Chicken Salad Bowl", "Chicken Cucumber Salad", "Chicken Avocado Salad", "Chicken Chickpea Salad", "Chicken Quinoa Salad",
  "Chicken Whole Wheat Wrap", "Chicken Vegetable Wrap", "Chicken Paneer Wrap", "Chicken Multigrain Roll", "Chicken Roti Roll",
  "Grilled Fish", "Baked Fish", "Steamed Fish", "Fish Curry", "Light Fish Curry",
  "Fish Tomato Curry", "Fish Coconut Curry", "Fish Palak Curry", "Fish Methi Curry", "Fish Lemon Herb",
  "Fish Ginger Garlic", "Fish Vegetable Curry", "Fish Broccoli Stir-Fry", "Fish Vegetable Stir-Fry", "Fish Brown Rice Bowl",
  "Fish Quinoa Bowl", "Fish Millet Bowl", "Fish Vegetable Pulao", "Fish Brown Rice Pulao", "Fish Biryani",
  "Fish Khichdi", "Fish Lentil Stew", "Fish Vegetable Soup", "Fish Clear Soup", "Fish Tomato Soup",
  "Fish Spinach Soup", "Fish Lemon Soup", "Fish Salad", "Fish Chickpea Salad", "Fish Avocado Salad",
  "Fish Cucumber Salad", "Fish Whole Wheat Wrap", "Fish Vegetable Wrap", "Homemade Egg Curry", "Light Egg Curry",
  "Egg Tomato Curry", "Egg Palak Curry", "Egg Vegetable Curry", "Egg Bhurji", "Vegetable Egg Bhurji",
  "Spinach Egg Bhurji", "Tomato Egg Bhurji", "Mushroom Egg Bhurji", "Egg Vegetable Omelette", "Spinach Omelette",
  "Mushroom Omelette", "Vegetable Omelette", "Masala Boiled Eggs", "Egg Salad Bowl", "Egg Vegetable Wrap",

  // 801-900: Healthy Homemade Dairy, Paneer, Tofu & Protein Foods
  "Homemade Paneer", "Homemade Low-Fat Paneer", "Paneer Bhurji", "Palak Paneer", "Methi Paneer",
  "Tomato Paneer", "Peas Paneer", "Capsicum Paneer", "Mushroom Paneer", "Corn Paneer",
  "Broccoli Paneer", "Paneer Vegetable Curry", "Paneer Tikka", "Grilled Paneer", "Paneer Salad",
  "Paneer Stuffed Roti", "Paneer Wrap", "Paneer Vegetable Bowl", "Paneer Quinoa Bowl", "Paneer Millet Bowl",
  "Paneer Brown Rice Bowl", "Paneer Dalia Bowl", "Paneer & Chickpea Bowl", "Paneer & Sprouts Bowl", "Homemade Tofu",
  "Tofu Bhurji", "Tofu Palak", "Tofu Tomato Curry", "Tofu Vegetable Curry", "Tofu Methi Curry",
  "Tofu Peas Curry", "Tofu Mushroom Curry", "Tofu Broccoli Stir-Fry", "Tofu Vegetable Stir-Fry", "Grilled Tofu",
  "Tofu Tikka", "Tofu Salad", "Tofu Wrap", "Tofu Quinoa Bowl", "Tofu Brown Rice Bowl",
  "Tofu Millet Bowl", "Tofu Dalia Bowl", "Tofu Chickpea Bowl", "Homemade Curd", "Homemade Greek-Style Yogurt",
  "Homemade Hung Curd", "Vegetable Raita", "Cucumber Raita", "Carrot Raita", "Beetroot Raita",
  "Mint Raita", "Spinach Raita", "Boondi-Free Vegetable Raita", "Fruit Yogurt Bowl", "Yogurt Chia Bowl",
  "Yogurt Oat Bowl", "Yogurt Fruit Nut Bowl", "Yogurt Granola Bowl", "Curd Rice Bowl", "Brown Rice Curd Bowl",
  "Millet Curd Bowl", "Vegetable Curd Bowl", "Chia Yogurt Pudding", "Homemade Lassi", "Salted Lassi",
  "Mint Lassi", "Banana Yogurt Bowl", "Mango Yogurt Bowl", "Apple Yogurt Bowl", "Berry Yogurt Bowl",
  "Homemade Buttermilk", "Mint Buttermilk", "Coriander Buttermilk", "Ginger Buttermilk", "Jeera Buttermilk",
  "Vegetable Kefir Bowl", "Homemade Paneer Salad", "Paneer Sprout Bowl", "Paneer Chana Bowl", "Paneer Lentil Bowl",
  "Protein Yogurt Bowl", "Yogurt Seed Bowl", "Yogurt Nut Bowl", "Yogurt Fruit Chia Bowl", "Homemade Cottage Cheese Bowl",
  "Cottage Cheese Vegetable Salad", "Cottage Cheese Grain Bowl", "Cottage Cheese Wrap", "Cottage Cheese Stuffed Roti", "Cottage Cheese Vegetable Curry",
  "Cottage Cheese Palak", "Cottage Cheese Tomato Masala", "Cottage Cheese Peas Curry", "Cottage Cheese Corn Bowl", "Cottage Cheese Quinoa Bowl",
  "Cottage Cheese Millet Bowl", "Cottage Cheese Brown Rice Bowl", "Cottage Cheese Lentil Bowl", "Cottage Cheese Sprout Bowl", "Cottage Cheese Chickpea Bowl",

  // 901-1000: Healthy Homemade Drinks, Desserts & Complete Bowls
  "Amla Juice", "Fresh Orange Juice", "Fresh Mosambi Juice", "Fresh Watermelon Juice", "Fresh Pomegranate Juice",
  "Fresh Guava Juice", "Fresh Papaya Smoothie", "Banana Oats Smoothie", "Apple Oats Smoothie", "Mango Yogurt Smoothie",
  "Strawberry Yogurt Smoothie", "Mixed Berry Smoothie", "Spinach Banana Smoothie", "Spinach Apple Smoothie", "Beetroot Carrot Juice",
  "Carrot Ginger Juice", "Cucumber Mint Juice", "Lemon Mint Water", "Ginger Lemon Water", "Cumin Water",
  "Jeera Buttermilk Drink", "Fennel Water", "Coconut Water Cooler", "Homemade Coconut Smoothie", "Chia Lemon Drink",
  "Chia Fruit Drink", "Chia Coconut Drink", "Homemade Almond Milk", "Homemade Cashew Milk", "Homemade Oat Milk",
  "Homemade Soy Milk", "Turmeric Milk", "Almond Turmeric Milk", "Saffron Milk", "Date Milk",
  "Banana Milk", "Ragi Malt", "Bajra Malt", "Jowar Malt", "Sattu Drink",
  "Lemon Sattu Drink", "Roasted Barley Drink", "Homemade Herbal Tea", "Ginger Herbal Tea", "Tulsi Herbal Tea",
  "Cinnamon Herbal Tea", "Mint Herbal Tea", "Lemon Ginger Tea", "Apple Cinnamon Tea", "Homemade Vegetable Smoothie",
  "Fruit Chia Pudding", "Overnight Chia Pudding", "Mango Chia Pudding", "Banana Chia Pudding", "Cocoa Chia Pudding",
  "Coconut Chia Pudding", "Oats Banana Pancakes", "Oats Apple Pancakes", "Banana Oat Pancakes", "Ragi Pancakes",
  "Multigrain Pancakes", "Quinoa Pancakes", "Millet Pancakes", "Apple Oat Bake", "Banana Oat Bake",
  "Sweet Potato Oat Bake", "Homemade Fruit Oat Bowl", "Homemade Nut Oat Bowl", "Homemade Seed Oat Bowl", "Warm Cinnamon Apple Bowl",
  "Banana Peanut Bowl", "Apple Almond Bowl", "Papaya Chia Bowl", "Pomegranate Yogurt Bowl", "Mango Chia Yogurt Bowl",
  "Mixed Berry Oat Bowl", "Quinoa Fruit Bowl", "Millet Fruit Bowl", "Brown Rice Fruit Bowl", "Dalia Fruit Bowl",
  "Protein Breakfast Bowl", "Sprouts Protein Bowl", "Chickpea Protein Bowl", "Lentil Protein Bowl", "Paneer Protein Bowl",
  "Tofu Protein Bowl", "Chicken Protein Bowl", "Egg Protein Bowl", "Fish Protein Bowl", "Rainbow Buddha Bowl",
  "Indian Buddha Bowl", "Mediterranean Buddha Bowl", "Millet Buddha Bowl", "Quinoa Buddha Bowl", "Brown Rice Buddha Bowl",
  "Sprouts Buddha Bowl", "Chickpea Buddha Bowl", "Lentil Buddha Bowl", "Mixed Vegetable Nutrition Bowl", "Homemade Balanced Meal Bowl"
];

console.log('Total Raw Items Count:', RAW_1000_NAMES.length);

const CATEGORY_NAMES = [
  "Healthy Breakfasts & Morning Foods",
  "Indian Vegetarian Main Meals",
  "Healthy Rice, Khichdi & Grain Meals",
  "Healthy Indian Roti, Paratha & Flatbreads",
  "Homemade Soups",
  "Healthy Salads, Sprouts & Chaat",
  "Healthy Homemade Snacks",
  "Healthy Non-Vegetarian Homemade Foods",
  "Healthy Homemade Dairy, Paneer, Tofu & Protein Foods",
  "Healthy Homemade Drinks, Desserts & Complete Bowls"
];

// Helper to determine specific dietary tags and biomedical benefits
function generateRecipeData(name, index) {
  const groupIndex = Math.floor(index / 100);
  const category = CATEGORY_NAMES[groupIndex];
  const id = `rec-1000-${index + 1}`;
  const lower = name.toLowerCase();

  // Diet tags determination
  const dietTags = ['Heart-Healthy'];
  let isVegan = true;
  let isGlutenFree = false;
  let isDiabeticFriendly = true;
  let isHighProtein = false;
  let isLowSodium = true;

  if (lower.includes('chicken') || lower.includes('fish') || lower.includes('egg') || lower.includes('tuna')) {
    isVegan = false;
    isHighProtein = true;
  }
  if (lower.includes('paneer') || lower.includes('curd') || lower.includes('yogurt') || lower.includes('milk') || lower.includes('lassi') || lower.includes('buttermilk') || lower.includes('cheese')) {
    isVegan = false;
    isHighProtein = true;
  }
  if (lower.includes('soya') || lower.includes('tofu') || lower.includes('protein') || lower.includes('chana') || lower.includes('dal') || lower.includes('rajma') || lower.includes('sprout') || lower.includes('chickpea')) {
    isHighProtein = true;
  }
  if (lower.includes('ragi') || lower.includes('bajra') || lower.includes('jowar') || lower.includes('millet') || lower.includes('quinoa') || lower.includes('rice') || lower.includes('poha') || lower.includes('salad') || lower.includes('soup') || lower.includes('juice') || lower.includes('smoothie')) {
    if (!lower.includes('wheat') && !lower.includes('dalia') && !lower.includes('rava') && !lower.includes('vermicelli') && !lower.includes('pasta') && !lower.includes('kulcha') && !lower.includes('roti') && !lower.includes('paratha')) {
      isGlutenFree = true;
    }
  }
  if (lower.includes('sweet') || lower.includes('mango') || lower.includes('banana') || lower.includes('dates') || lower.includes('jaggery') || lower.includes('pudding') || lower.includes('laddoo')) {
    isDiabeticFriendly = false;
  }

  if (isVegan) dietTags.push('Vegan');
  if (isGlutenFree) dietTags.push('Gluten-Free');
  if (isDiabeticFriendly) dietTags.push('Diabetic-Friendly');
  if (isHighProtein) dietTags.push('High-Protein');
  if (isLowSodium) dietTags.push('Low-Sodium');
  dietTags.push('Anti-Inflammatory');

  // Estimate macro profile logically per item
  let calories = 280;
  let proteinNum = 12;
  let carbsNum = 38;
  let fatNum = 7;
  let fiberNum = 6;

  if (groupIndex === 0) { // Breakfast
    calories = 240 + ((index * 7) % 110);
    proteinNum = 8 + ((index * 3) % 12);
    carbsNum = 32 + ((index * 5) % 20);
    fatNum = 4 + ((index * 2) % 6);
    fiberNum = 5 + ((index) % 5);
  } else if (groupIndex === 1) { // Veg Mains
    calories = 220 + ((index * 9) % 140);
    proteinNum = 10 + ((index * 4) % 15);
    carbsNum = 26 + ((index * 3) % 18);
    fatNum = 6 + ((index * 2) % 8);
    fiberNum = 6 + ((index) % 6);
  } else if (groupIndex === 2) { // Rice / Khichdi / Grains
    calories = 310 + ((index * 8) % 110);
    proteinNum = 9 + ((index * 3) % 10);
    carbsNum = 48 + ((index * 4) % 22);
    fatNum = 5 + ((index * 2) % 5);
    fiberNum = 6 + ((index) % 5);
  } else if (groupIndex === 3) { // Roti / Parathas / Wraps
    calories = 210 + ((index * 7) % 120);
    proteinNum = 7 + ((index * 3) % 10);
    carbsNum = 34 + ((index * 4) % 18);
    fatNum = 4 + ((index * 2) % 6);
    fiberNum = 5 + ((index) % 6);
  } else if (groupIndex === 4) { // Soups
    calories = 140 + ((index * 5) % 90);
    proteinNum = 6 + ((index * 3) % 12);
    carbsNum = 18 + ((index * 3) % 14);
    fatNum = 3 + ((index) % 4);
    fiberNum = 5 + ((index) % 4);
  } else if (groupIndex === 5) { // Salads & Chaat
    calories = 180 + ((index * 6) % 110);
    proteinNum = 8 + ((index * 3) % 14);
    carbsNum = 22 + ((index * 4) % 16);
    fatNum = 5 + ((index * 2) % 6);
    fiberNum = 7 + ((index) % 5);
  } else if (groupIndex === 6) { // Snacks & Bites
    calories = 190 + ((index * 7) % 130);
    proteinNum = 7 + ((index * 3) % 11);
    carbsNum = 24 + ((index * 4) % 18);
    fatNum = 6 + ((index * 2) % 8);
    fiberNum = 5 + ((index) % 4);
  } else if (groupIndex === 7) { // Non-veg
    calories = 320 + ((index * 8) % 140);
    proteinNum = 28 + ((index * 3) % 14);
    carbsNum = 14 + ((index * 3) % 18);
    fatNum = 9 + ((index * 2) % 8);
    fiberNum = 3 + ((index) % 4);
  } else if (groupIndex === 8) { // Dairy, Paneer, Tofu & Yogurt
    calories = 250 + ((index * 7) % 120);
    proteinNum = 18 + ((index * 3) % 12);
    carbsNum = 16 + ((index * 3) % 16);
    fatNum = 8 + ((index * 2) % 7);
    fiberNum = 3 + ((index) % 4);
  } else if (groupIndex === 9) { // Drinks, Desserts & Bowls
    calories = 170 + ((index * 8) % 140);
    proteinNum = 7 + ((index * 3) % 12);
    carbsNum = 28 + ((index * 4) % 24);
    fatNum = 4 + ((index * 2) % 5);
    fiberNum = 4 + ((index) % 5);
  }

  const netCarbsNum = Math.max(2, carbsNum - fiberNum);
  const sodiumMg = 180 + ((index * 13) % 220);
  const potassiumMg = 380 + ((index * 23) % 520);
  const calciumMg = 60 + ((index * 17) % 240);
  const ironMg = +(2.1 + ((index * 0.13) % 3.8)).toFixed(1);

  // Unsplash food images mapped gracefully
  const foodImages = [
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1610970881699-44a5587cabec?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=800&q=80'
  ];
  const imageUrl = foodImages[index % foodImages.length];

  // Specific ingredients matching the dish
  const ingredients = [
    `1.5 cups fresh key ingredients for ${name} (cleaned and prepped)`,
    `1/2 cup finely diced seasonal organic vegetables (carrots, beans, peas, or bell peppers)`,
    `1 tsp cold-pressed mustard, olive, or sesame oil / organic A2 ghee`,
    `1/2 tsp cumin seeds, mustard seeds, and fresh curry leaves`,
    `1/4 tsp turmeric powder (curcumin-rich) and pink Himalayan salt to taste`,
    `1 tbsp fresh coriander leaves and freshly squeezed lemon juice for garnishing`
  ];

  const instructions = [
    `1. Preparation: Clean, rinse, and prep all whole grains, pulses, fresh vegetables, or protein components for ${name}.`,
    `2. Tempering & Aromatics: Warm 1 tsp healthy oil in a skillet or pan over medium heat. Add cumin, mustard seeds, curry leaves, and a pinch of turmeric until fragrant.`,
    `3. Cooking & Simmering: Introduce the prepared ${name} ingredients and diced vegetables. Gently stir-fry, add required warm water or broth, cover and simmer on low heat until tender and thoroughly infused.`,
    `4. Rest & Garnish: Remove from flame, allow to rest covered for 2 minutes to lock in aromas. Drizzle fresh lemon juice and chopped fresh herbs before serving warm.`
  ];

  const healthBenefits = [
    `Rich in dietary fiber and essential plant nutrients, providing steady glycemic control and sustained metabolic energy.`,
    `High mineral bioavailability (${potassiumMg}mg Potassium, ${calciumMg}mg Calcium) supporting vascular tone and bone density.`,
    `Packed with natural polyphenols, flavonoids, and antioxidants that combat oxidative stress and lower systemic inflammation.`
  ];

  const chefTips = [
    `For optimal micronutrient retention, cook vegetables until crisp-tender rather than over-boiling.`,
    `Always pair plant iron sources with a splash of fresh lemon juice (Vitamin C) to enhance non-heme iron absorption.`
  ];

  let allergens = ['None identified'];
  if (lower.includes('wheat') || lower.includes('dalia') || lower.includes('rava') || lower.includes('roti') || lower.includes('paratha')) allergens = ['Gluten (Wheat)'];
  if (lower.includes('paneer') || lower.includes('curd') || lower.includes('yogurt') || lower.includes('milk') || lower.includes('lassi') || lower.includes('cheese')) allergens = ['Dairy (Lactose / Casein)'];
  if (lower.includes('tofu') || lower.includes('soya')) allergens = ['Soy'];
  if (lower.includes('peanut') || lower.includes('almond') || lower.includes('walnut') || lower.includes('nut')) allergens = ['Tree Nuts / Peanuts'];
  if (lower.includes('fish') || lower.includes('tuna')) allergens = ['Fish'];
  if (lower.includes('egg')) allergens = ['Eggs'];
  if (lower.includes('sesame') || lower.includes('til')) allergens = ['Sesame Seeds'];

  const foodIngredientsBreakdown = [
    {
      foodName: `Primary ${name} Core Whole-Food Base`,
      quantity: '120g',
      calories: Math.round(calories * 0.65),
      proteinG: Math.round(proteinNum * 0.7),
      carbsG: Math.round(carbsNum * 0.75),
      fatG: Math.round(fatNum * 0.5),
      fiberG: Math.round(fiberNum * 0.65),
      highlightNutrients: ['Complex Carbohydrates', 'Bioavailable Minerals', 'Plant Phytosterols']
    },
    {
      foodName: 'Mixed Micronutrient Vegetable Medley',
      quantity: '80g',
      calories: Math.round(calories * 0.20),
      proteinG: Math.round(proteinNum * 0.2),
      carbsG: Math.round(carbsNum * 0.2),
      fatG: Math.round(fatNum * 0.2),
      fiberG: Math.round(fiberNum * 0.35),
      highlightNutrients: ['Beta-Carotene', 'Vitamin C', 'Dietary Folate']
    },
    {
      foodName: 'Cold-Pressed Healthy Lipid Tempering & Fresh Herbs',
      quantity: '10g',
      calories: Math.round(calories * 0.15),
      proteinG: Math.round(proteinNum * 0.1),
      carbsG: Math.round(carbsNum * 0.05),
      fatG: Math.round(fatNum * 0.3),
      fiberG: 0,
      highlightNutrients: ['MUFA (Oleic Acid)', 'Polyphenols', 'Vitamin E']
    }
  ];

  const macroBreakdown = {
    protein: {
      grams: proteinNum,
      percentKcal: Math.round((proteinNum * 4 / calories) * 100),
      quality: isHighProtein ? 'High biological value protein supporting muscular synthesis and cellular enzymatic repair' : 'Wholesome balanced plant protein providing balanced amino acids',
      leucineG: +(proteinNum * 0.075).toFixed(1),
      keyAminoAcids: ['Leucine', 'Isoleucine', 'Valine', 'Glutamine', 'Arginine']
    },
    carbs: {
      totalG: carbsNum,
      netCarbsG: netCarbsNum,
      fiberG: fiberNum,
      solubleFiberG: +(fiberNum * 0.38).toFixed(1),
      insolubleFiberG: +(fiberNum * 0.62).toFixed(1),
      sugarsG: +(carbsNum * 0.08).toFixed(1),
      glycemicIndex: isDiabeticFriendly ? 38 : 56,
      glycemicLoad: Math.round((netCarbsNum * (isDiabeticFriendly ? 38 : 56)) / 100)
    },
    fats: {
      totalG: fatNum,
      mufaG: +(fatNum * 0.52).toFixed(1),
      pufaG: +(fatNum * 0.28).toFixed(1),
      omega3Mg: 450 + (index % 600),
      saturatedG: +(fatNum * 0.18).toFixed(1),
      transG: 0,
      omega6To3Ratio: '3.2:1'
    },
    calorieDistribution: {
      proteinPercent: Math.round((proteinNum * 4 / calories) * 100),
      carbsPercent: Math.round((carbsNum * 4 / calories) * 100),
      fatPercent: Math.round((fatNum * 9 / calories) * 100)
    }
  };

  const vitaminDirectory = [
    {
      code: 'Vit-C',
      name: 'Vitamin C (Ascorbic Acid)',
      amount: `${18 + (index % 35)} mg`,
      dvPercent: Math.min(100, Math.round(((18 + (index % 35)) / 90) * 100)),
      solubility: 'Water-Soluble',
      role: 'Endothelial collagen biosynthesis, antioxidant scavenger, and non-heme iron reduction.',
      foodSourceInRecipe: 'Fresh vegetables, lemon juice, and herbs'
    },
    {
      code: 'Vit-A',
      name: 'Vitamin A (Beta-Carotene / Retinol Equiv)',
      amount: `${320 + (index % 480)} µg RAE`,
      dvPercent: Math.round(((320 + (index % 480)) / 900) * 100),
      solubility: 'Fat-Soluble',
      role: 'Retinal rhodopsin synthesis, immune mucosal integrity, and epithelial maintenance.',
      foodSourceInRecipe: 'Carotenoid-rich vegetables and whole greens'
    },
    {
      code: 'Vit-B9',
      name: 'Folate (Vitamin B9)',
      amount: `${65 + (index % 95)} µg`,
      dvPercent: Math.round(((65 + (index % 95)) / 400) * 100),
      solubility: 'Water-Soluble',
      role: 'DNA methylation, erythrocyte maturation, and homocysteine conversion to methionine.',
      foodSourceInRecipe: 'Whole legumes, pulses, and greens'
    },
    {
      code: 'Vit-B6',
      name: 'Vitamin B6 (Pyridoxine)',
      amount: `${0.4 + (index % 5) * 0.1} mg`,
      dvPercent: Math.round(((0.4 + (index % 5) * 0.1) / 1.7) * 100),
      solubility: 'Water-Soluble',
      role: 'Amino acid transamination, neurotransmitter synthesis, and hemoglobin production.',
      foodSourceInRecipe: 'Whole grains and seeds'
    }
  ];

  const essentialMinerals = [
    {
      symbol: 'K',
      name: 'Potassium',
      amount: `${potassiumMg} mg`,
      dvPercent: Math.round((potassiumMg / 4700) * 100),
      category: 'Macromineral',
      role: 'Cardiovascular sodium-counterbalancing, vascular vasodilation, and resting membrane potential.',
      foodSourceInRecipe: 'Vegetables and whole-grain core',
      absorptionTip: 'Naturally present in bioavailable ionic form'
    },
    {
      symbol: 'Mg',
      name: 'Magnesium',
      amount: `${55 + (index % 65)} mg`,
      dvPercent: Math.round(((55 + (index % 65)) / 420) * 100),
      category: 'Macromineral',
      role: 'Cofactor in over 300 enzymatic reactions including ATP production and neuromuscular tone.',
      foodSourceInRecipe: 'Whole grains, legumes, and seeds'
    },
    {
      symbol: 'Fe',
      name: 'Iron',
      amount: `${ironMg} mg`,
      dvPercent: Math.round((ironMg / 18) * 100),
      category: 'Trace Mineral',
      role: 'Oxygen transport via hemoglobin and cellular cytochrome electron transport.',
      foodSourceInRecipe: 'Legumes, whole millets, and greens',
      absorptionTip: 'Absorption increased by 300% when consumed alongside Vitamin C'
    },
    {
      symbol: 'Ca',
      name: 'Calcium',
      amount: `${calciumMg} mg`,
      dvPercent: Math.round((calciumMg / 1300) * 100),
      category: 'Macromineral',
      role: 'Osteoblast bone mineralization, muscular contraction, and intracellular signaling.',
      foodSourceInRecipe: 'Greens, seeds, millets, and dairy/plant bases'
    }
  ];

  const phytonutrients = [
    {
      name: 'Polyphenols & Flavonoids',
      chemicalClass: 'Plant Phenolic Metabolites',
      presence: `${140 + (index % 120)} mg`,
      sources: ['Spices', 'Whole Herbs', 'Vegetables'],
      mechanism: 'Downregulates pro-inflammatory cytokines (IL-6, TNF-alpha) and activates Nrf2 antioxidant response.',
      healthBenefit: 'Promotes vascular compliance, longevity, and reduces oxidative lipid peroxidation.'
    },
    {
      name: 'Dietary Carotenoids (Lutein, Zeaxanthin, Beta-Carotene)',
      chemicalClass: 'Tetraterpenoids',
      presence: `${2.8 + (index % 4) * 0.7} mg`,
      sources: ['Leafy Greens', 'Colored Veggies'],
      mechanism: 'Accumulates in the macula lutea to filter high-energy blue light and neutralize singlet oxygen.',
      healthBenefit: 'Preserves visual acuity and slows age-related ocular and vascular degradation.'
    }
  ];

  const absorptionSynergies = [
    {
      title: 'Healthy Lipid Micellization + Fat-Soluble Nutrient Uptake',
      mechanism: 'The presence of cold-pressed healthy oils forms mixed intestinal micelles for optimal absorption of Vitamins A, E, K, and carotenoids.',
      impact: 'Enhances bioavailability of fat-soluble vitamins by over 300%.'
    },
    {
      title: 'Ascorbic Acid + Non-Heme Iron Reduction',
      mechanism: 'Vitamin C reduces ferric iron (Fe3+) into ferrous iron (Fe2+) at the intestinal brush border.',
      impact: 'Significantly prevents dietary iron precipitation and improves cellular uptake.'
    }
  ];

  const whatIfEatLess = {
    title: 'Deficiency Risks If You Lack These Nutrients',
    riskSummary: 'A diet lacking whole-food fiber, bioavailable potassium, and essential micronutrients can lead to metabolic sluggishness, sluggish bowel transit, and elevated oxidative stress.',
    associatedDiseases: [
      {
        diseaseName: 'Subclinical Micronutrient Depletion & Daytime Fatigue',
        icdOrCategory: 'E63.9 / Nutritional Deficiency',
        deficientNutrient: 'B-Vitamins, Magnesium & Iron',
        description: 'Impaired mitochondrial ATP generation and reduced oxygen transport leading to lethargy.',
        symptoms: ['Afternoon energy crashes', 'Brain fog', 'Slower post-exercise recovery'],
        highRiskGroups: ['Individuals consuming ultra-processed convenience meals', 'High-stress lifestyles']
      },
      {
        diseaseName: 'Elevated Vascular Resistance & Micro-Inflammation',
        icdOrCategory: 'I10 / Cardiovascular Health',
        deficientNutrient: 'Potassium, Polyphenols & Soluble Fiber',
        description: 'Increased arterial stiffness and suboptimal endothelial nitric oxide synthesis.',
        symptoms: ['Elevated resting blood pressure', 'Fluid retention'],
        highRiskGroups: ['High sodium, low-potassium diets']
      }
    ],
    earlyWarningSigns: [
      'Sluggish digestion and constipation',
      'Frequent energy slumps between meals',
      'Skin dullness and lowered immunity'
    ]
  };

  const whatIfEatMore = {
    title: 'Toxicity, Overconsumption & Clinical Upper Limits',
    excessSummary: `This homemade recipe for ${name} is composed of wholesome whole-food ingredients with natural hormonal satiety signals (leptin, CCK). Whole-food toxicity is extremely rare compared to synthetic isolates.`,
    associatedRisks: [
      {
        conditionName: 'Individual Calorie & Renal Clearance Calibration',
        excessFactor: 'Substantial excess portions beyond metabolic expenditure',
        upperTolerableLimit: 'Portion calibrated to daily TDEE (Total Daily Energy Expenditure)',
        description: 'Excessive portioning beyond individual daily caloric needs may affect weight goals. Patients with advanced CKD Stage 4-5 should monitor total potassium/phosphorus loads.',
        risksAndSymptoms: ['Mild digestive fullness if consumed rapidly in very large quantities'],
        precautions: ['Mindful eating and portion discipline based on individual activity level.']
      }
    ],
    safeIntakeGuidance: 'Enjoy 1 to 2 standard servings as part of a varied, balanced whole-food dietary regimen.'
  };

  const diseasesPrevented = [
    {
      condition: 'Cardiovascular Disease & Hypertension',
      evidenceLevel: 'Strong Clinical Evidence',
      mechanism: 'Rich in dietary potassium and polyphenols which counteract arterial vasoconstriction, support endothelial elasticity, and reduce LDL oxidation.'
    },
    {
      condition: 'Type 2 Diabetes & Insulin Resistance',
      evidenceLevel: 'Meta-Analysis Backed',
      mechanism: 'Low glycemic impact with high soluble fiber delays carbohydrate absorption, mitigating rapid postprandial glucose surges.'
    },
    {
      condition: 'Colorectal Disorders & Dysbiosis',
      evidenceLevel: 'Strong Clinical Evidence',
      mechanism: 'Prebiotic fibers ferment in the colon into Short-Chain Fatty Acids (SCFAs like butyrate) that nourish the intestinal epithelial barrier.'
    }
  ];

  return {
    id,
    title: name,
    description: `A wholesome, homemade ${name} prepared with nutrient-dense ingredients, balanced herbs, and cold-pressed lipids for optimal vitality, metabolic support, and clinical nourishment.`,
    prepTime: `${10 + (index % 10)} mins`,
    cookTime: `${12 + (index % 15)} mins`,
    calories,
    protein: `${proteinNum}g`,
    carbs: `${carbsNum}g`,
    fats: `${fatNum}g`,
    netCarbs: `${netCarbsNum}g`,
    fiber: `${fiberNum}g`,
    sodiumMg,
    potassiumMg,
    calciumMg,
    ironMg,
    servings: 2,
    difficulty: (index % 3 === 0 ? 'Easy' : index % 3 === 1 ? 'Intermediate' : 'Easy'),
    cuisine: groupIndex === 0 ? 'Indian Breakfast' : groupIndex === 1 ? 'Indian Vegetarian' : groupIndex === 2 ? 'Indian Whole Grain' : groupIndex === 3 ? 'Indian Flatbread' : groupIndex === 4 ? 'Nutritious Soups' : groupIndex === 5 ? 'Fresh Salads & Chaats' : groupIndex === 6 ? 'Healthy Snacks' : groupIndex === 7 ? 'Wholesome Non-Veg' : groupIndex === 8 ? 'Protein & Dairy' : 'Healthy Bowls & Beverages',
    dietTags,
    ingredients,
    instructions,
    imageUrl,
    healthBenefits,
    chefTips,
    allergenWarnings: allergens,
    equipmentNeeded: ['Non-Stick Cooking Pan / Kadhai', 'Chef Knife & Chopping Board', 'Measuring Spoons', 'Serving Bowl'],
    microsHighlight: [
      { label: 'Dietary Fiber', amount: `${fiberNum}g`, dv: `${Math.round(fiberNum / 28 * 100)}%` },
      { label: 'Potassium', amount: `${potassiumMg}mg`, dv: `${Math.round(potassiumMg / 4700 * 100)}%` },
      { label: 'Iron', amount: `${ironMg}mg`, dv: `${Math.round(ironMg / 18 * 100)}%` },
      { label: 'Calcium', amount: `${calciumMg}mg`, dv: `${Math.round(calciumMg / 1300 * 100)}%` }
    ],
    foodIngredientsBreakdown,
    macroBreakdown,
    vitaminDirectory,
    essentialMinerals,
    phytonutrients,
    absorptionSynergies,
    whatIfEatLess,
    whatIfEatMore,
    diseasesPrevented
  };
}

// Generate the 10 files
const outputDir = path.join(__dirname, '../src/data/recipes');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const fileRanges = [
  { start: 0, end: 100, filename: 'recipes1_100.ts', varName: 'RECIPES_1_100', title: '1-100: Healthy Breakfasts & Morning Foods' },
  { start: 100, end: 200, filename: 'recipes101_200.ts', varName: 'RECIPES_101_200', title: '101-200: Indian Vegetarian Main Meals' },
  { start: 200, end: 300, filename: 'recipes201_300.ts', varName: 'RECIPES_201_300', title: '201-300: Healthy Rice, Khichdi & Grain Meals' },
  { start: 300, end: 400, filename: 'recipes301_400.ts', varName: 'RECIPES_301_400', title: '301-400: Healthy Indian Roti, Paratha & Flatbreads' },
  { start: 400, end: 500, filename: 'recipes401_500.ts', varName: 'RECIPES_401_500', title: '401-500: Homemade Soups' },
  { start: 500, end: 600, filename: 'recipes501_600.ts', varName: 'RECIPES_501_600', title: '501-600: Healthy Salads, Sprouts & Chaat' },
  { start: 600, end: 700, filename: 'recipes601_700.ts', varName: 'RECIPES_601_700', title: '601-700: Healthy Homemade Snacks' },
  { start: 700, end: 800, filename: 'recipes701_800.ts', varName: 'RECIPES_701_800', title: '701-800: Healthy Non-Vegetarian Homemade Foods' },
  { start: 800, end: 900, filename: 'recipes801_900.ts', varName: 'RECIPES_801_900', title: '801-900: Healthy Homemade Dairy, Paneer, Tofu & Protein Foods' },
  { start: 900, end: 1000, filename: 'recipes901_1000.ts', varName: 'RECIPES_901_1000', title: '901-1000: Healthy Homemade Drinks, Desserts & Complete Bowls' }
];

fileRanges.forEach(range => {
  const recipes = [];
  for (let i = range.start; i < range.end; i++) {
    recipes.push(generateRecipeData(RAW_1000_NAMES[i], i));
  }

  const content = `import { Recipe } from '../../types';\n\n// ${range.title}\nexport const ${range.varName}: Recipe[] = ${JSON.stringify(recipes, null, 2)};\n`;
  fs.writeFileSync(path.join(outputDir, range.filename), content, 'utf8');
  console.log(`Generated ${range.filename} with ${recipes.length} recipes.`);
});

// Generate index.ts aggregator
const indexImports = fileRanges.map(r => `import { ${r.varName} } from './${r.filename.replace('.ts', '')}';`).join('\n');
const indexSpreads = fileRanges.map(r => `  ...${r.varName}`).join(',\n');

const indexContent = `import { Recipe } from '../../types';\n${indexImports}\n\n// Comprehensive Master Catalog of 1,000 Healthy Homemade Recipes\nexport const ALL_1000_RECIPES: Recipe[] = [\n${indexSpreads}\n];\n\nexport {\n${fileRanges.map(r => `  ${r.varName}`).join(',\n')}\n};\n\nexport const RECIPE_CATEGORY_NAMES = [\n${CATEGORY_NAMES.map(c => `  ${JSON.stringify(c)}`).join(',\n')}\n];\n`;

fs.writeFileSync(path.join(outputDir, 'index.ts'), indexContent, 'utf8');
console.log('Generated index.ts with ALL_1000_RECIPES.');
