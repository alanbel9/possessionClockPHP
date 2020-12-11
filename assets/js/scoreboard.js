if (typeof BEL !== 'object') {
    var BEL = {}
}

BEL.scoreBoard = {

    score_board_id : 'score-team-',
    score_team_1: 0,
    score_team_2: 0,

    /**
     *
     * @param points
     * @param team
     */
    updateScore: function (points, team) {
        var scoreTeam = jQuery('#' + BEL.scoreBoard.score_board_id + team);
        var currentScore = 0;
        var newValue = 0;

        if (scoreTeam) {
            if (points === 0) {
                newValue = points;
            } else {
                if (team === 1) {
                    currentScore = BEL.scoreBoard.score_team_1;
                    newValue = points + currentScore;
                    BEL.scoreBoard.score_team_1 = newValue;
                } else {
                    currentScore = BEL.scoreBoard.score_team_2;
                    newValue = points + currentScore;
                    BEL.scoreBoard.score_team_2 = newValue;
                }
            }

            scoreTeam.val(newValue);
        }
    }
};