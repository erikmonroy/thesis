// capture info from Prolific
var subject_id = jsPsych.data.getURLVariable('PROLIFIC_PID');
var study_id = jsPsych.data.getURLVariable('STUDY_ID');
var session_id = jsPsych.data.getURLVariable('SESSION_ID');

jsPsych.data.addProperties({
    subject_id: subject_id,
    study_id: study_id,
    session_id: session_id
});

/* create timeline */
var timeline = [];

/* define welcome message trial */

var preload = {
    type: 'preload',
    images: ['images/dot.png', 'images/dot_lo.png','images/dot_hi.png']
  }
  timeline.push(preload);

var instructions = {
    type: 'instructions',
    pages: [
        'Welcome to the experiment. Press the right arrow key to continue.',
        `In this experiment, a circle will appear in the center 
        of the screen, shown below:
        <br> <img src="images/dot.png"></img>
        <br>Your objective is to keep the circle blue, or within range.
        <br><br>Press the right arrow key to continue.`,
        `Here is an example of the circle below range:
        <br><img src="images/dot_lo.png"></img>
        <br>While below range (in the red), use the right arrow key ➡️ to enlargen the circle and return it to blue, or within range.
        <br>Note that there is a delay in the effect.
        <br><br>Press the right arrow key to continue.`,
        `Here is an example of the circle above range:
        <br><img src="images/dot_hi.png"></img>
        <br>While above range (in the yellow), use the left arrow key ⬅️ to shrink the circle and return it to blue, or within range.
        <br>Note that there is a delay in the effect.
        <br><br>Press the right arrow key to continue.`,
        `Your task is to keep the circle blue, or within range, as much as possible.
        <br>Following the trial, you will answer some questions about your experience and try the experiment once more.
        <br><br>Once you finish the entire experiment, your page will be redirected to Prolific for confirmation. 
        <br>Thank you for your participation and good luck!
        <br><br>Press the right arrow key to begin.`
    ],
    show_clickable_nav: false
}
timeline.push(instructions);

var experiment1 = {
    type: 'control-game'
};
timeline.push(experiment1);

var freeResponse = {
    type: 'survey-text',
    preamble: '<p>Thank you for completing the trial. Below are free-response questions about your experience.<br>Please provide as much detail when possible.</p>',
    questions: [
        {prompt: "Did you notice anything about the circle's size in relation to pressing the arrow keys?", name: 'Arrows', required:false, rows: 5, columns: 80},
        {prompt: 'While participating, did the game remind of you of anything? <br>If there are multiple things that come to mind, feel free to list them. If nothing comes to mind, you may skip.', name: 'Remind', required:false, rows: 5, columns: 80}, 
        {prompt: 'Is there any knowledge of yours that you felt helped you to perform the experiment?', name: 'Knowledge', required:false, rows: 5, columns: 80}
      ],
};
timeline.push(freeResponse);

var questions_options = ["Yes", "No"];

var diabetes_question = {
    type: 'survey-multi-choice',
    questions: [
        {prompt: "Do you have any experience managing diabetes, either your own or another person's?", name: 'Diabetes', options: questions_options, required:true}
    ],
};
timeline.push(diabetes_question);

var diabetes_options = ["Glucometer (finger prick and meter)","Syringe or insulin pen","Continuous Glucose Monitor (CGM)","Insulin pump","Software or mobile app for diabetes"];

var tech_question = {
    type: 'survey-multi-select',
    questions: [
        {prompt: "Please select from the following list all of those which you have experience with:", name: 'Tech', options: diabetes_options, required:false}
    ],
};

var if_node = {
    timeline: [tech_question],
    conditional_function: function(){
        // get the data from the previous trial,
        // and check which choice was selected
        var data = jsPsych.data.get().last(1).values()[0];
        if(data.response["Diabetes"] == questions_options[1]){
            return false;
        } else {
            return true;
        }
    }
}

timeline.push(if_node);

var instructions2 = {
    type: 'instructions',
    pages: [`The game you just played simulates diabetes.
        <br>The circle represents the concentration of sugar in the blood.
        <br><br>The left arrow key (⬅️) represents insulin, which is a medication that decreases blood sugar. Insulin's effect has a delay.
        <br><br>The right arrow key (➡️) represents a candy, which increases blood sugar. The effect of candy on blood sugar also has a delay.
        <br><br>You will now play the game one more time.
        <br>Following the game you will be redirected to Prolific for study end confirmation. 
        <br> Thank you for your time thus far and good luck! <br><br> Press the right arrow key to begin the final trial.`],
    show_clickable_nav: false
}
timeline.push(instructions2);

var experiment2 = {
    type: 'control-game',
    events: [{type:'hi',factor:2,time:0},{type:'lo',factor:2,time:45},]
};
timeline.push(experiment2);

var explain = {
    type: 'instructions',
    pages: [`Thank you for participating in the experiment.
        <br><br>`]
}

var save_server_data = {
    type: 'call-function',
    func: function () {
      var data = jsPsych.data.get().json();
      var xhr = new XMLHttpRequest();
      xhr.open('POST', 'php/save_json.php');
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify({ filedata: data }));
    },
    post_trial_gap: 1000
};
timeline.push(save_server_data);

/* start the experiment */
jsPsych.init({
    timeline: timeline,
    // For prolific redirect
    on_finish: function(){
        window.location = "https://app.prolific.co/submissions/complete?cc=67D2B26B"
    }
});

