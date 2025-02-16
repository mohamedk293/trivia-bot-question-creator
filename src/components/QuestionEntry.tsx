import React, {ChangeEvent, useState} from 'react';
import Question, {QuestionData} from './Question.tsx';
// TODO: add an export to json :)
function QuestionEntry(){
    let [question, setQuestion] = useState<string>("");
    let [choices, setChoices] = useState({a: "", b: "", c: "", d: ""});
    let [correct_answer_index, setCorrectAnswer] = useState<number>(0);
    let [current_answer, setCurrentAnswer] = useState<string>("a");
    let [questions_saved, setQuestionsSaved] = useState<Array<QuestionData>>([]);
    let [copy_status, setCopyStatus] = useState<string>("Copy to Clipboard");
    let [choice_input, setChoiceInput] = useState<string>("");

    // much better fix for finding choices :)
    const choiceIndexDict: {[letter: string] : number} = {'A': 0, 'B': 1, 'C': 2, 'D': 3};

    function setTriviaQuestion(event: ChangeEvent<HTMLInputElement>){
        setQuestion(event.target.value);
    }

    function setCurrentTriviaChoice(event: ChangeEvent<HTMLSelectElement>){
        setCurrentAnswer(event.target.value.toLowerCase());
        setChoiceInput(choices[event.target.value.toLowerCase() as keyof typeof choices]); // resets the input to the contents of the choice selected
    }

    function setTriviaAnswer(event: ChangeEvent<HTMLSelectElement>){
        // Updated for better implementation
        setCorrectAnswer(choiceIndexDict[event.target.value]);
    }

    function setCurrentChoice(event: ChangeEvent<HTMLInputElement>){
        setChoiceInput(event.target.value);
        switch (current_answer){
            case "a":
                setChoices({...choices, a: event.target.value});
                break;
            case "b":
                setChoices({...choices, b: event.target.value});
                break;
            case "c":
                setChoices({...choices, c: event.target.value});
                break;
            case "d":
                setChoices({...choices, d: event.target.value});
                break;
            default:
                console.log("incorrect answer choice! something's gone wrong :(");
                break;
            
        }
    }

    function getQuestionsAsArray(): Array<string> {
        return ["A: " + choices.a, "B: " + choices.b, "C: " + choices.c, "D: " + choices.d];
    }

    function resetStates(){
        setQuestion("");
        setCurrentAnswer("a");
        setChoiceInput("");
    }

    function addQuestionToSavedData(){
        // TODO: decide if resseting states is worth it after clicking.
        let new_question: QuestionData = {
            question: question,
            choices: getQuestionsAsArray(),
            correct_index: correct_answer_index
        };
        setQuestionsSaved([...questions_saved, new_question]);
        resetStates();
    }

    function copyJSONtoClipboard(){
        // Makes the questions saved JSON files with indentations of two spaces
        let json_content = JSON.stringify(questions_saved, undefined, 2);

        navigator.clipboard.writeText(json_content);
        setCopyStatus("Copied!");
        setTimeout(() => {
            setCopyStatus("Copy to Clipboard");
        }, 1000);
    }

    function deleteEntryFromList(index: number) {
        // filters out the element with the matching index
        let filteredQuestionList = questions_saved.filter((_, i: number) => {
            index !== i
        });
        setQuestionsSaved(filteredQuestionList);
    }

    const questionChoiceElements = getQuestionsAsArray().map((question_content: string) => {
        if (question_content[0] == getQuestionsAsArray()[correct_answer_index][0]){
            return <li className="correct-answer">{"Question choice " + question_content}</li>;
        } else {
            return <li>{"Question choice " + question_content}</li>;
        }
    });

    // added indexes so that delete function works :)
    const questionDisplayContainers = questions_saved.map((questionData: QuestionData, index: number) =>
        <li><Question question={questionData.question} choices={questionData.choices} correct_index={questionData.correct_index} list_index={index} click_action={deleteEntryFromList}/></li>
    );

    return (
        <div className="container">
        <div className="trivia-input-container">
            <h2>Trivia Question Creator for TriviaBot</h2>
            <input type="text" onChange={setTriviaQuestion} value={question} placeholder="Question"/><br />
            <input type="text" onChange={setCurrentChoice} value={choice_input} placeholder={"Edit answer choice for " + current_answer.toUpperCase()}/>
            <select onChange={setCurrentTriviaChoice} value={current_answer.toUpperCase()}>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
            </select>
            <div>The correct answer for this question is:
            <select onChange={setTriviaAnswer}>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
            </select></div>
        </div>
        <div className="question-display-container">
            <div className="question"><b>Question asked: </b>{question}</div>
            <ul className="question-choices">
                {questionChoiceElements}
            </ul>
            <div><button onClick={addQuestionToSavedData}>Add to Question List</button><button onClick={copyJSONtoClipboard}>{copy_status}</button></div>
        </div>
        <div className="question-header">Questions ({questions_saved.length})</div>
        <div className="saved-questions-container">
            <ul className="question-list">
                {questionDisplayContainers}
            </ul>
        </div>
        </div>
    );
}

export default QuestionEntry;