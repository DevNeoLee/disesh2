const data = {
    "title": "Pre Quiz",
    "questions": [
        {
            "id": "1",
            "question": "Which of the following is TRUE about your group?",
            "choices": ["There are FIVE Farmers in your group who share a limited amount of groundwater resources.",
                        "All participants may communicate with each other during the exercise.",
                        "Both of the above."
                    ],
            "answer": "a",
            "comment": "Hint: This is a 5-player game where all participants act as farmers who share a limited amount of groundwater resources. They are not allowed to communicate with each other throughout the exercise.",
            "hint": "Hint: This is a 5-player game where all participants act as farmers who share a limited amount of groundwater resources. They are not allowed to communicate with each other throughout the exercise."
        },
        {
            "id": "2",
            "question": "Which of the following is FALSE about a Farmer’s decision?",
            "choices": ["Each Farmer must decide which crop (Crop A or Crop B) to plant in each round.",
                        "Each farmer’s crop choice does NOT affect the remaining amount of shared groundwater.",
                        "When each Farmer makes a decision in a round, (s)he CANNOT know the other Farmers’ decisions in that round.",
                    ],
            "answer": "b",
            "comment": "Hint: Each Farmer must choose between Crop A and Crop B in each round without knowledge of the other Farmers’ choices. The chosen crop affects the remaining groundwater at the end of each round, as each crop consumes a different amount of water.",
            "hint": "Hint: Each Farmer must choose between Crop A and Crop B in each round without knowledge of the other Farmers’ choices. The chosen crop affects the remaining groundwater at the end of each round, as each crop consumes a different amount of water.",
        },
        {
            "id": "3",
            "question": "Which of the following is FALSE about the shared groundwater?",
            "choices": [ "In each round, the total amount of groundwater used in your group is determined by each farmer’s crop choice.", 
            "The more Farmers choose Crop A instead of Crop B, the more groundwater remains at the end of each round.",
            "Neither of the above"],
            "answer": "c",
            "comment": "Hint: Crop A consumes less water than Crop B. Therefore, each Farmer’s crop choice determines the total amount of groundwater used in their group.",
            "hint": "Hint: Crop A consumes less water than Crop B. Therefore, each Farmer’s crop choice determines the total amount of groundwater used in their group."

        },
        {
            "id": "4",
            "question": "Which of the following is TRUE about the shared groundwater?",
            "choices": [ "Except for the last round, the groundwater will recharge with 5 units of water immediately after all Farmers make decisions in each round.",
            "The remaining groundwater (including the groundwater recharge) from the current round is the same as the total groundwater available for your group in the next round.",
            "Both of the above."],
            "answer": "c",
            "comment": "Hint: At the end of each round (except the last round), the groundwater supply recharges by 5 units of water immediately after all five Farmers choose either Crop A or Crop B. The remaining groundwater in each round includes 5 units of the groundwater recharge. This remaining groundwater serves as the total available groundwater for the next round.",
            "hint": "Hint: At the end of each round (except the last round), the groundwater supply recharges by 5 units of water immediately after all five Farmers choose either Crop A or Crop B. The remaining groundwater in each round includes 5 units of the groundwater recharge. This remaining groundwater serves as the total available groundwater for the next round."
        },
        {
            "id": "5",
            "question": "Which of the following is TRUE about the end of this decision exercise?",
            "choices": [ "Regardless of the remaining groundwater, this exercise will continue until the last round.",
            "This exercise will end even before reaching the last round if the remaining groundwater level (including groundwater recharge) drops below 15 units of water in a round.",
            "The more Farmers decide to plant Crop B, the more likely it is that this exercise will continue longer."],
            "answer": "b",
            "comment": "Hint: If the remaining groundwater (including 5 units of the groundwater recharge) is equal to or more than 15 units in a round, participants can play the next round; otherwise, the game will end even before the last round. Keep in mind that Crop B consumes more water than Crop A.",
            "hint": "Hint: If the remaining groundwater (including 5 units of the groundwater recharge) is equal to or more than 15 units in a round, participants can play the next round; otherwise, the game will end even before the last round. Keep in mind that Crop B consumes more water than Crop A."

        },
        {
            "id": "6",
            "question": "Which of the following is FALSE about Farmers’ income?",
            "choices": [
                "Each Farmer’s total income throughout this exercise is NOT affected by the others’ crop choices.",
                "Compared to Crop A, Crop B yields higher income and consumes more water.",
                "Each Farmer’s total income throughout this exercise is affected by the remaining groundwater in each round."
            ],
            "answer": "a",
            "comment": "Hint: Compared to Crop A, Crop B consumes more water and yields higher income. Each Farmer’s total income throughout this exercise is the sum of his or her own income until this exercise ends. If the remaining groundwater is less than 15 units, this exercise will end earlier than the last round. The more Farmers decide to plant Crop B, the more likely it is that this exercise will end earlier. In such a case, each Farmer will lose a chance to increase his or her own income.",
            "hint": "Hint: Compared to Crop A, Crop B consumes more water and yields higher income. Each Farmer’s total income throughout this exercise is the sum of his or her own income until this exercise ends. If the remaining groundwater is less than 15 units, this exercise will end earlier than the last round. The more Farmers decide to plant Crop B, the more likely it is that this exercise will end earlier. In such a case,each Farmer will lose a chance to increase his or her own income."
        }
    ],
    "questions2": [
        {
            "id": "1",
            "question": "Which of the following is TRUE about the end of this decision-making exercise? Please compare the previous exercise and the current exercise.",
            "choices": 
                    [
                        "Like the previous exercise, the current exercise will continue until the last round regardless of the remaining groundwater.",
                        "Like the previous exercise, the current exercise will end when the remaining groundwater (including the groundwater recharge) is less than 15 units.",
                        "The more Farmers decide to plant Crop B, the more likely it is that this exercise will continue longer."
                    ],
            "answer": "b", 
            "comment": "Hint: The conditions for concluding this exercise remain unchanged. If, at the end of a round, the remaining groundwater (including 5 units of the groundwater recharge) equals or exceeds 15 units, participants proceed to the next round; otherwise, the exercise will conclude even before reaching the last round. Remember that Crop B consumes more water than Crop A.",
            "hint": "Hint: The conditions for concluding this exercise remain unchanged. If, at the end of a round, the remaining groundwater (including 5 units of the groundwater recharge) equals or exceeds 15 units, participants proceed to the next round; otherwise, the exercise will conclude even before reaching the last round. Remember that Crop B consumes more water than Crop A."
        },
        {
            "id": "2",
            "question": "Which of the following is TRUE about the groundwater that remains unused by your group until the last round? Please compare the previous exercise and the current exercise. ",
            "choices": 
                    [
                        "Like the previous exercise, in the current exercise, you have no chance to earn an extra income by leaving groundwater unused until the last round.",
                        "The amount of extra income you receive remains constant, regardless of the quantity of groundwater unused by your group until the last round.",
                        "To qualify for the extra income, your group must leave at least 25 units of groundwater unused until the last round."
                    ],
            "choicesB": 
                    [
                        "Like the previous exercise, in the current exercise, you have no chance to earn an extra income by leaving groundwater unused until the last round.",
                        "The amount of extra income you receive remains constant, regardless of the quantity of groundwater unused by your group until the last round.",
                        "To qualify for the extra income, EACH member of your group MUST use 16 units of groundwater or less until the last round."
                    ],
            "answer": "c", 
            "comment": "Hint: In the previous exercise, there is no extra income resulting from the groundwater unused in your group until the last round. In the current exercise, however, your group members can receive the extra income if they meet two conditions: 1) the exercise must continue until the last round; and 2) the minimum amount of groundwater that must remain unused by your group until the last round is 25 units. The more groundwater your group leaves unused until the last round, the higher the extra income you are likely to receive.",
            "commentB": "Hint: In the previous exercise, there is no extra income resulting from the groundwater unused in your group. In the current exercise, however, your group members can receive the extra income if they meet two conditions: 1) the exercise must continue until the last round; and 2) the maximum amount of groundwater that each member of your group can use until the last round is 16 units. The more groundwater your group leaves unused until the last round, the higher the extra income you are likely to receive.",
            "hint": "Hint: In the previous exercise, there is no extra income resulting from the groundwater unused in your group until the last round. In the current exercise, however, your group members can receive the extra income if they meet two conditions: 1) the exercise must continue until the last round; and 2) the minimum amount of groundwater that must remain unused by your group until the last round is 25 units. The more groundwater your group leaves unused until the last round, the higher the extra income you are likely to receive.",
            "hintB": "Hint: In the previous exercise, there is no extra income resulting from the groundwater unused in your group. In the current exercise, however, your group members can receive the extra income if they meet two conditions: 1) the exercise must continue until the last round; and 2) the maximum amount of groundwater that each member of your group can use until the last round is 16 units. The more groundwater your group leaves unused until the last round, the higher the extra income you are likely to receive."

        },
        {
            "id": "3",
            "question": "Suppose your group successfully reaches the goal of leaving the targeted amount of groundwater unused until the last round. Which of the following is TRUE about the extra income resulting from this achievement?",
            "questionI": "Suppose each member of your group successfully uses the targeted amount of groundwater until the last round. Which of the following is TRUE about the extra income resulting from this achievement?",
            "choices": 
                    [
                        "The extra income you receive is always the same as that of the other members of your group.",
                        "The extra income you receive increases as you more frequently decide to plant Crop A, which consumes less water than Crop B.",
                        "The extra income you receive increases as you more frequently decide to plant Crop B, which consumes more water than Crop A."
                    ],
            "answer": "a", 
            "answerB": "b", 
            "answerC": "c", 
            "comment": "Hint: In the current exercise, you will receive extra income if your group achieves the goal of leaving at least 25 units of groundwater unused until the last round. Based on this achievement, the extra income is distributed evenly among all members of your group.",
            "commentB": "Hint: In the current exercise, you will receive extra income if your group achieves the goal of leaving at least 25 units of groundwater unused until the last round. Based on this achievement, your extra income increases when you more frequently decide to plant Crop A, which consumes less water than Crop B.",
            "hint": "Hint: In the current exercise, you will receive extra income if your group achieves the goal of leaving at least 25 units of groundwater unused until the last round. Based on this achievement, the extra income is distributed evenly among all members of your group.",
            "hintB": "Hint: In the current exercise, you will receive extra income if each member of your group achieves the goal of using 16 units of groundwater or less until the last round. Based on this achievement, the extra income is distributed evenly among all members of your group.",
            "hintF": "Hint: In the current exercise, you will receive extra income if your group achieves the goal of leaving at least 25 units of groundwater unused until the last round. Based on this achievement, your extra income increases when you more frequently decide to plant Crop A, which consumes less water than Crop B.",
            "hintS":  "Hint: In the current exercise, you will receive extra income if your group achieves the goal of leaving at least 25 units of groundwater unused until the last round. Based on this achievement, your extra income increases when you more frequently decide to plant Crop B, which consumes more water than Crop A.", 
            "hintIS": "Hint: In the current exercise, you will receive extra income if each member of your group achieves the goal of using 16 units of groundwater or less until the last round. Based on this achievement, your extra income increases when you more frequently decide to plant Crop B, which consumes more water than Crop A.",
            "hintIF": "Hint: In the current exercise, you will receive extra income if each member of your group achieves the goal of using 16 units of groundwater or less until the last round. Based on this achievement, your extra income increases when you more frequently decide to plant Crop A, which consumes less water than Crop B.",
        },       
    ]
};

export default data;