if (typeof BEL !== 'object') {
    var BEL = {}
}

BEL.scoreBoard = {
    score_board_id : 'score-team-',
    scores: {
        1 : 0,  // Team 1
        2 : 0   // Team 2
    },

    /**
     * Update Team Score Process
     * @param points
     * @param team
     */
    updateScore: function (points, team) {
        var scoreTeam = jQuery('#' + BEL.scoreBoard.score_board_id + team);
        var currentScore = 0;
        var newValue = 0;

        if (scoreTeam) {
            // Get current TEAM SCORE
            currentScore = BEL.scoreBoard.scores[team];

            // Get new value to be saved
            newValue = (points !== 0) ? points + currentScore : points;

            // Save TEAM SCORE
            BEL.scoreBoard.scores[team] = newValue;
            scoreTeam.val(newValue);
        }
    }
};