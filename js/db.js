let url = 'https://api.jsonbin.io/v3/b/677f2f87acd3cb34a8c6779e';
const api_key = '$2a$10$BJILLPcMNHNpDjd9JV1rR.NCCGf4cCLYc34Sg3Tccazre4UToxMXq';
const headers = { "X-Master-Key": api_key }

async function getHighScores() {
    const response = await fetch(url, { headers });
    const data = await response.json();
    return data.record;
}

async function oui() {
    let uwu = await getHighScores();
    console.log(uwu);
}

async function addHighScore(name, score) {
    const leaderboard = await getHighScores();
    leaderboard.push({ name, score });
    leaderboard.sort((a, b) => b.score - a.score);

    await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "X-Master-Key": api_key
        },
        body: JSON.stringify(leaderboard)
    });
}

async function non() {
    await addHighScore("Charlie", 120);

    let uwu2 = await getHighScores();
    console.log(uwu2);
}
