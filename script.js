document.addEventListener('DOMContentLoaded', function () {

    // varibales declaration
    const usernameInput = document.getElementById('username')
    const btn = document.querySelector('.btn');
    const stat = document.querySelector('.stat-data')
    // const easy = document.getElementById('easy-label')
    const easyLabel = document.getElementById("easy-label");
    const allLabel = document.getElementById("all-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");
    const easyCircle = document.querySelector('.easy-progress')
    const mediumCircle = document.querySelector('.medium-progress')
    const hardCircle = document.querySelector('.hard-progress')
    const allCircle = document.querySelector('.all-progress')
    const statData = document.querySelector('.stat-data') 

    // checking username is correct or not 
    function validateUsername(username) {
        if (username.trim() === "") {
            alert("Username should not be empty");
            return false;
        }
        const regex = /^[a-zA-Z0-9_-]{1,15}$/;
        const isMatching = regex.test(username);
        if (!isMatching) {
            alert("Invalid Username");
        }
        return isMatching;
    }

    // taking username from the user and checking vaild or not if it is valid then pass to fetch
    btn.addEventListener('click', function () {
        const username = usernameInput.value;
        console.log(username)
        if (validateUsername(username)) {
            fetchDetails(username);
        }
    })

    // Fetch funtion to get the detials using api call
    async function fetchDetails(username) {
        try {
            btn.textContent = "Searching...";
            btn.disabled = true;
            btn.classList.add('gray')

            // fetching api
            const proxyUrl = 'https://cors-anywhere.herokuapp.com/'
            const targetUrl = 'https://leetcode.com/graphql/';
            const url = proxyUrl + targetUrl;

            const myHeaders = new Headers();
            myHeaders.append("content-type", "application/json");
            const graphql = JSON.stringify({
                query: "\n    query userSessionProgress($username: String!) {\n  allQuestionsCount {\n    difficulty\n    count\n  }\n  matchedUser(username: $username) {\n    submitStats {\n      acSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n      totalSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n    }\n  }\n}\n    ",
                variables: { "username": `${username}` }
            })
            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: graphql,
            };

            const response = await fetch(url, requestOptions);
            if (!response.ok) {
                throw new Error("Unable to fetch the User details");
            }
            const parsedData = await response.json();
            console.log("Logging data: ", parsedData);
           // stat.innerHTML = `<p>${parsedData}</p>`
           showData(parsedData)
            submissionData(parsedData);

        }
        catch (error) {
            stat.innerHTML = `<p>${error.message}</p>`
        }
        finally {
            btn.textContent = "Search";
            btn.disabled = false;
            btn.classList.remove('gray')
        }

    }

    // getting data from the json file and passing to a function which set the value to circle
    function showData(parsedData){
      const total = parsedData.data.allQuestionsCount[0].count;
      const totalEasyQues = parsedData.data.allQuestionsCount[1].count;
      const totalMediumQues = parsedData.data.allQuestionsCount[2].count;
      const totalHardQues = parsedData.data.allQuestionsCount[3].count;

      const solvedTotalQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[0].count;
      const solvedTotalEasyQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[1].count;
      const solvedTotalMediumQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[2].count;
      const solvedTotalHardQues = parsedData.data.matchedUser.submitStats.acSubmissionNum[3].count;


      
    //   console.log('total' , total)
    //   console.log('totalEasy' , totalEasyQues)
    //   console.log('totalMedium' , totalMediumQues)
    //   console.log('totalHard' , totalHardQues)
    //   console.log('total solved' , solvedTotalQues)
    //   console.log('total solved easy' , solvedTotalEasyQues)
    //   console.log('total solved med' , solvedTotalMediumQues)
    //   console.log('total solved hard' , solvedTotalHardQues)
        setTOCircle(totalEasyQues,solvedTotalEasyQues,easyLabel,easyCircle);
        setTOCircle(totalMediumQues,solvedTotalMediumQues,mediumLabel,mediumCircle);
        setTOCircle(totalHardQues,solvedTotalHardQues,hardLabel,hardCircle);
        setTOCircle(total,solvedTotalQues,allLabel,allCircle);
        // subData(totalSub,totalSubeasy,totalSubmedium,totalSubhard)
    }

// setting properties to the circles
function setTOCircle(total,solved,label,circle){
const percent = (solved/total)*100;
circle.style.setProperty("--progress-degree", `${percent}%`);
label.textContent = `${solved} / ${total}`;
label.style.marginTop = '40px';
}

// ADDING Submissions 
 function submissionData(parsedData)
{
    // const totalSub = parsedData.data.matchedUser.totalSubmissionNum[0].submissions;
      const totalSubeasy = parsedData.data.matchedUser.submitStats.totalSubmissionNum[1].submissions;
      const totalSubmedium = parsedData.data.matchedUser.submitStats.totalSubmissionNum[2].submissions;
      const totalSubhard = parsedData.data.matchedUser.submitStats.totalSubmissionNum[3].submissions;
 statData.innerHTML = `<br><h1>SUBMISSIONS</h1><br>OVERALL SUBMISSIONS: ${totalSubeasy}<br> EASY SUBMISSIONS: ${totalSubeasy} <BR> MEDIUM SUBMISSIONS: ${totalSubmedium}<br> HARD SUBMISSIONS: ${totalSubhard}` 
}



})