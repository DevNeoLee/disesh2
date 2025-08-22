export const states = ['Alabama','Alaska','American Samoa','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District of Columbia','Federated States of Micronesia','Florida','Georgia','Guam','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Marshall Islands','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Northern Mariana Islands','Ohio','Oklahoma','Oregon','Palau','Pennsylvania','Puerto Rico','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virgin Island','Virginia','Washington','West Virginia','Wisconsin','Wyoming']

const data = {
    "title": "Survey Questionnaire",
    "questions": [
        {
            "id": "1",
            "question": "Which of the following categories does your age fall into?",
            "type": "radio",
            "choices": ["Under 26", "26 - 35", "36 - 45", "46 - 55", "56 - 65", "Over 65"],

        },
        {
            "id": "2",
            "question": "With which gender do you most identify?",
            "type": "radio",
            "choices": ["Woman", "Man", "Non-binary or Gender diverse"],
        },
        {
            "id": "3",
            "question": "In which state do you currently live?",
            "type": "dropdown",
        },
        {
            "id": "4",
            "question": "What is the highest level of school you have completed or the highest degree you have received?",
            "type": "radio",
            "choices": ["Less than high school degree", "High school degree or equivalent (e.g., GED)", "Some college but no degree", "Associate degree", "Bachelor degree", "Graduate degree"],
        },
        {
            "id": "5",
            "question": "Which of these describes your personal income last year?",
            "type": "radio",
            "choices": ["< $10,000", "$10,000–19,999", "$20,000–29,999", "$30,000–39,999", "$40,000–49,999", "$50,000–74,999", "$75,000–99,999", "$100,000–149,999", "$150,000 and greater"],
        },
        {
            "id": "6",
            "question": "During the next 12 months, how likely is it that you will be able to make all of your(electricity/water/rent) payments on time?",
            "type": "radio",
            "choices": ["Not likely at all", "Slightly likely", "Moderately likely", "Very likely", "Extremely likely"],
        },
        {
            "id": "7",
            "question": "Which of the following best describes your political views?",
            "type": "radio",
            "choices": ["Extremely liberal", "Moderately liberal", "Slightly liberal", "Neither liberal nor conservative", "Slightly conservative", "Moderately conservative", "Extremely conservative"],
        },
        {
            "id": "8",
            "question": "Which income tax structure in the Unites States do you prefer?",
            "type": "radio",
            "choices": ["A tax rate that is the same for everyone, regardless of income or wealth", "A tax system where people with more income pay more in taxes."],
        },
        {
            "id": "9",
            "question": "Let’s get back to the very first round of this exercise. What was your initial expectation regarding other participants’ likelihood to choose Crop A which consumes less water to yield lower payoff?",
            "type": "radio",
            "choices": ["Expected that others will NOT likely choose Crop A AT ALL", "Expected that others will SLIGHTLY likely choose Crop A", "Expected that others will MODERATELY likely choose Crop A", "Expected that others will VERY likely choose Crop A", "Expected that others will EXTREMELY likely choose Crop A"],
        },
        {
            "id": "10",
            "question": "Considering your response to Question 9, how closely was your initial expectation regarding other participants’ likelihood to choose Crop A (which consumes less water to yield lower payoff) matched with what you observed?",
            "type": "radio",
            "choices": ["Not matched at all", "Slightly matched", "Moderately matched", "Strongly matched", "Very strongly matched"],
        },
        {
            "id": "11",
            "question": "Considering your response to Question 10, how significantly did the degree of the match between your expectation and observation affect your decisions?",
            "type": "radio",
            "choices": [
                "Not significantly at all", 
                "Slightly significantly",
                "Moderately significantly",
                "Very significantly",
                "Extremely significantly"
                ]
        },
        {
            "id": "12",
            "question": "Do you think that most participants in this exercise would try to take advantage of you if they got the chance or would they try to be fair?",
            "type": "radio",
            "choices": ["Take advantage", "Try to be fair"],
        }
    ]
};

export default data;