const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: '🏏 Cricket Commentary Server',
        status: 'running',
        socketPath: '/socket.io/',
        time: new Date().toISOString()
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        clients: io.engine.clientsCount,
        time: new Date().toISOString()
    });
});

io.on('connection', (socket) => {
    console.log('✅ Client connected:', socket.id);
    console.log('📊 Total clients:', io.engine.clientsCount);

    socket.emit('match_event', {
        type: 'MATCH_STATUS',
        payload: {
            status: 'Welcome',
            summary: `🏆 Welcome to T20 World Cup Final 2024 - India's First 10 Overs!`
        },
        timestamp: Date.now(),
        id: `welcome-${Date.now()}`
    });

    socket.on('join_match', (data) => {
        const { matchId } = data;
        console.log(`📡 Client ${socket.id} joined match: ${matchId}`);
        socket.join(matchId);

        socket.emit('match_event', {
            type: 'MATCH_STATUS',
            payload: {
                status: 'Joined Match',
                summary: `Joined match room: ${matchId}`
            },
            timestamp: Date.now(),
            id: `join-${Date.now()}`
        });

        startMockEvents(socket, matchId);
    });

    socket.on('disconnect', (reason) => {
        console.log('❌ Client disconnected:', socket.id, 'Reason:', reason);
        console.log('📊 Remaining clients:', io.engine.clientsCount);
    });

    socket.on('error', (error) => {
        console.error('❌ Socket error:', error);
    });
});

io.engine.on('connection_error', (err) => {
    console.log('❌ Connection error:');
    console.log('  Code:', err.code);
    console.log('  Message:', err.message);
    console.log('  Context:', err.context);
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
    console.log(`🏏 Cricket Commentary Server Started`);
    console.log(`🌐 Listening on port ${PORT}`);
});

const indiaFirst10OversEvents = [
    {
        type: 'MATCH_STATUS',
        payload: {
            status: 'Match Started',
            summary: '🏆 T20 World Cup Final 2024 - India vs South Africa at Kensington Oval, Barbados'
        },
    },
    {
        type: 'MATCH_STATUS',
        payload: {
            status: 'Toss Update',
            summary: 'India wins toss and elects to bat first. Rohit Sharma and Virat Kohli to open!'
        },
    },

    {
        type: 'BALL',
        payload: {
            runs: 0,
            commentary: 'Rabada starts with a dot! Rohit defends the first ball of the final. Tension in the air!',
            over: 1, ball: 1, batsman: 'R. Sharma', bowler: 'K. Rabada'
        },
    },
    {
        type: 'BALL',
        payload: {
            runs: 1,
            commentary: 'Rohit gets off the mark! Pushes to mid-on and scampers through. India 1/0',
            over: 1, ball: 2, batsman: 'R. Sharma', bowler: 'K. Rabada'
        },
    },
    {
        type: 'BALL',
        payload: {
            runs: 0,
            commentary: 'Kohli takes guard. Rabada bowls a sharp bouncer, Kohli ducks under it.',
            over: 1, ball: 3, batsman: 'V. Kohli', bowler: 'K. Rabada'
        },
    },
    {
        type: 'BOUNDARY',
        payload: {
            runs: 4,
            commentary: 'FOUR! Kohli is away! Classic cover drive, races to the boundary! What a shot to start!',
            over: 1, ball: 4, batsman: 'V. Kohli', bowler: 'K. Rabada'
        },
    },
    {
        type: 'BALL',
        payload: {
            runs: 0,
            commentary: 'Dot ball. Kohli defends back to Rabada. Good comeback from the pacer.',
            over: 1, ball: 5, batsman: 'V. Kohli', bowler: 'K. Rabada'
        },
    },
    {
        type: 'BALL',
        payload: {
            runs: 2,
            commentary: 'Two runs! Kohli clips through square leg, good running between the wickets. India 7/0',
            over: 1, ball: 6, batsman: 'V. Kohli', bowler: 'K. Rabada'
        },
    },

    {
        type: 'BALL',
        payload: {
            runs: 1,
            commentary: 'Rohit rotates strike with a single to third man. Nortje into the attack.',
            over: 2, ball: 1, batsman: 'R. Sharma', bowler: 'A. Nortje'
        },
    },
    {
        type: 'BALL',
        payload: {
            runs: 0,
            commentary: 'Dot ball! Kohli defends the sharp bouncer from Nortje. 145 kmph!',
            over: 2, ball: 2, batsman: 'V. Kohli', bowler: 'A. Nortje'
        },
    },
    {
        type: 'BALL',
        payload: {
            runs: 1,
            commentary: 'Single to cover. Kohli pushes and runs hard. Good cricket from India.',
            over: 2, ball: 3, batsman: 'V. Kohli', bowler: 'A. Nortje'
        },
    },
    {
        type: 'WICKET',
        payload: {
            playerOut: 'R. Sharma',
            dismissal: 'Caught behind',
            commentary: 'WICKET! Rohit edges behind! Nortje gets the breakthrough! QdK takes a sharp catch!',
            over: 2, ball: 4, bowler: 'A. Nortje'
        },
    },
    {
        type: 'MATCH_STATUS',
        payload: {
            status: 'Wicket Fall',
            summary: 'Rohit Sharma c QdK b Nortje 2(3). Rishabh Pant comes to the crease. India 9/1'
        },
    },
    {
        type: 'BALL',
        payload: {
            runs: 0,
            commentary: 'Pant takes guard in the final! First ball defended solidly.',
            over: 2, ball: 5, batsman: 'R. Pant', bowler: 'A. Nortje'
        },
    },
    {
        type: 'BOUNDARY',
        payload: {
            runs: 4,
            commentary: 'FOUR! Pant is away! Flicks through mid-wicket with authority!',
            over: 2, ball: 6, batsman: 'R. Pant', bowler: 'A. Nortje'
        },
    },
    {
        type: 'BALL',
        payload: {
            runs: 1,
            commentary: 'Kohli works Ngidi to fine leg for a single.',
            over: 3, ball: 1, batsman: 'V. Kohli', bowler: 'L. Ngidi'
        },
    },
    {
        type: 'BALL',
        payload: {
            runs: 2,
            commentary: 'Two runs! Pant drives through covers, fielder cuts it off.',
            over: 3, ball: 2, batsman: 'R. Pant', bowler: 'L. Ngidi'
        },
    },
    {
        type: 'BALL',
        payload: {
            runs: 0,
            commentary: 'Dot ball. Pant tries to cut but misses. Good length from Ngidi.',
            over: 3, ball: 3, batsman: 'R. Pant', bowler: 'L. Ngidi'
        },
    },
    {
        type: 'BOUNDARY',
        payload: {
            runs: 4,
            commentary: 'FOUR! Pant finds the gap! Drives through extra cover!',
            over: 3, ball: 4, batsman: 'R. Pant', bowler: 'L. Ngidi'
        },
    },
    {
        type: 'BALL',
        payload: {
            runs: 1,
            commentary: 'Single to mid-on. Pant pushes and runs.',
            over: 3, ball: 5, batsman: 'R. Pant', bowler: 'L. Ngidi'
        },
    },
    {
        type: 'BALL',
        payload: {
            runs: 0,
            commentary: 'Dot to end the over. Kohli defends back to Ngidi. India 21/1 after 3.',
            over: 3, ball: 6, batsman: 'V. Kohli', bowler: 'L. Ngidi'
        },
    },

    {
        type: 'BALL',
        payload: {
            runs: 1,
            commentary: 'Kohli clips Jansen to square leg for one. Left-arm pace.',
            over: 4, ball: 1, batsman: 'V. Kohli', bowler: 'M. Jansen'
        },
    },
    {
        type: 'BALL',
        payload: {
            runs: 0,
            commentary: 'Dot ball! Pant defends back to Jansen.',
            over: 4, ball: 2, batsman: 'R. Pant', bowler: 'M. Jansen'
        },
    },
    {
        type: 'BOUNDARY',
        payload: {
            runs: 6,
            commentary: 'SIX! Pant goes big! Picks up the length and deposits it over deep square leg!',
            over: 4, ball: 3, batsman: 'R. Pant', bowler: 'M. Jansen'
        },
    },
    {
        type: 'BALL',
        payload: {
            runs: 1,
            commentary: 'Single to third man. Pant guides it down.',
            over: 4, ball: 4, batsman: 'R. Pant', bowler: 'M. Jansen'
        },
    },
    {
        type: 'BALL',
        payload: {
            runs: 2,
            commentary: 'Two runs! Kohli drives through covers, good running.',
            over: 4, ball: 5, batsman: 'V. Kohli', bowler: 'M. Jansen'
        },
    },
    {
        type: 'BALL',
        payload: {
            runs: 0,
            commentary: 'Dot ball to end. Kohli defends the yorker well.',
            over: 4, ball: 6, batsman: 'V. Kohli', bowler: 'M. Jansen'
        },
    },

    {
        type: 'BALL',
        payload: {
            runs: 1,
            commentary: 'Pant works the spinner to long-on for one.',
            over: 5, ball: 1, batsman: 'R. Pant', bowler: 'K. Maharaj'
        },
    },
    {
        type: 'BALL',
        payload: {
            runs: 0,
            commentary: 'Dot ball! Kohli defends the arm ball from Maharaj.',
            over: 5, ball: 2, batsman: 'V. Kohli', bowler: 'K. Maharaj'
        },
    },
    {
        type: 'BOUNDARY',
        payload: {
            runs: 4,
            commentary: 'FOUR! Kohli sweeps! Gets down and sweeps through square leg!',
            over: 5, ball: 3, batsman: 'V. Kohli', bowler: 'K. Maharaj'
        },
    },
    {
        type: 'BALL',
        payload: {
            runs: 1,
            commentary: 'Single to long-off. Kohli drives and takes the run.',
            over: 5, ball: 4, batsman: 'V. Kohli', bowler: 'K. Maharaj'
        },
    },
    {
        type: 'BALL',
        payload: {
            runs: 2,
            commentary: 'Two runs! Pant reverse sweeps, gets it fine of third man.',
            over: 5, ball: 5, batsman: 'R. Pant', bowler: 'K. Maharaj'
        },
    },
    {
        type: 'BALL',
        payload: {
            runs: 1,
            commentary: 'Single to end the over. India 43/1 after 5 overs.',
            over: 5, ball: 6, batsman: 'R. Pant', bowler: 'K. Maharaj'
        },
    },

    {
        type: 'BALL',
        payload: {
            runs: 0,
            commentary: 'Rabada returns! Kohli defends the first ball.',
            over: 6, ball: 1, batsman: 'V. Kohli', bowler: 'K. Rabada'
        },
    },
    {
        type: 'BOUNDARY',
        payload: {
            runs: 4,
            commentary: 'FOUR! Kohli punches through covers! What timing!',
            over: 6, ball: 2, batsman: 'V. Kohli', bowler: 'K. Rabada'
        },
    },
    {
        type: 'BALL',
        payload: {
            runs: 1,
            commentary: 'Single to third man. Kohli guides it down.',
            over: 6, ball: 3, batsman: 'V. Kohli', bowler: 'K. Rabada'
        },
    },
    {
        type: 'BALL',
        payload: {
            runs: 2,
            commentary: 'Two runs! Pant flicks through mid-wicket.',
            over: 6, ball: 4, batsman: 'R. Pant', bowler: 'K. Rabada'
        },
    },
    {
        type: 'BALL',
        payload: {
            runs: 0,
            commentary: 'Dot ball! Pant swings and misses.',
            over: 6, ball: 5, batsman: 'R. Pant', bowler: 'K. Rabada'
        },
    },
    {
        type: 'BOUNDARY',
        payload: {
            runs: 6,
            commentary: 'SIX! Pant finishes the powerplay in style! Over long-on!',
            over: 6, ball: 6, batsman: 'R. Pant', bowler: 'K. Rabada'
        },
    },

    {
        type: 'MATCH_STATUS',
        payload: {
            status: 'Powerplay End',
            summary: 'End of powerplay! India 60/1. Kohli 18*, Pant 25*. Great start!'
        },
    },

    {
        type: 'BALL',
        payload: {
            runs: 1,
            commentary: 'Shamsi into the attack! Kohli works to long-on.',
            over: 7, ball: 1, batsman: 'V. Kohli', bowler: 'T. Shamsi'
        },
    },
    {
        type: 'BALL',
        payload: {
            runs: 0,
            commentary: 'Dot ball! Pant defends the googly.',
            over: 7, ball: 2, batsman: 'R. Pant', bowler: 'T. Shamsi'
        },
    },
    {
        type: 'WICKET',
        payload: {
            playerOut: 'R. Pant',
            dismissal: 'Stumped',
            commentary: 'STUMPED! Pant comes down but misses the googly! QdK is quick!',
            over: 7, ball: 3, bowler: 'T. Shamsi'
        },
    },
    {
        type: 'MATCH_STATUS',
        payload: {
            status: 'Wicket Fall',
            summary: 'Pant st QdK b Shamsi 25(16). Suryakumar Yadav comes in. India 61/2'
        },
    },
    {
        type: 'BALL',
        payload: {
            runs: 0,
            commentary: 'SKY takes guard! First ball defended carefully.',
            over: 7, ball: 4, batsman: 'S. Yadav', bowler: 'T. Shamsi'
        },
    },
    {
        type: 'BALL',
        payload: {
            runs: 1,
            commentary: 'SKY gets off the mark! Pushes to cover.',
            over: 7, ball: 5, batsman: 'S. Yadav', bowler: 'T. Shamsi'
        },
    },
    {
        type: 'BALL',
        payload: {
            runs: 2,
            commentary: 'Two runs! Kohli sweeps fine, good running.',
            over: 7, ball: 6, batsman: 'V. Kohli', bowler: 'T. Shamsi'
        },
    },

    {
        type: 'BALL',
        payload: {
            runs: 1,
            commentary: 'SKY works Nortje to fine leg for one.',
            over: 8, ball: 1, batsman: 'S. Yadav', bowler: 'A. Nortje'
        },
    },
    {
        type: 'BALL',
        payload: {
            runs: 0,
            commentary: 'Dot ball! Kohli defends the bouncer.',
            over: 8, ball: 2, batsman: 'V. Kohli', bowler: 'A. Nortje'
        },
    },
    {
        type: 'BOUNDARY',
        payload: {
            runs: 4,
            commentary: 'FOUR! Kohli drives through covers! Sublime timing!',
            over: 8, ball: 3, batsman: 'V. Kohli', bowler: 'A. Nortje'
        },
    },
    {
        type: 'BALL',
        payload: {
            runs: 1,
            commentary: 'Single to point. Kohli pushes and runs.',
            over: 8, ball: 4, batsman: 'V. Kohli', bowler: 'A. Nortje'
        },
    },
    {
        type: 'BALL',
        payload: {
            runs: 2,
            commentary: 'Two runs! SKY cuts through backward point.',
            over: 8, ball: 5, batsman: 'S. Yadav', bowler: 'A. Nortje'
        },
    },
    {
        type: 'BALL',
        payload: {
            runs: 0,
            commentary: 'Dot to end. SKY defends back to Nortje.',
            over: 8, ball: 6, batsman: 'S. Yadav', bowler: 'A. Nortje'
        },
    },

    {
        type: 'BALL',
        payload: {
            runs: 1,
            commentary: 'Kohli drives Maharaj to long-off for one.',
            over: 9, ball: 1, batsman: 'V. Kohli', bowler: 'K. Maharaj'
        },
    },
    {
        type: 'BOUNDARY',
        payload: {
            runs: 4,
            commentary: 'FOUR! SKY sweeps! Gets it fine of square leg!',
            over: 9, ball: 2, batsman: 'S. Yadav', bowler: 'K. Maharaj'
        },
    },
    {
        type: 'BALL',
        payload: {
            runs: 1,
            commentary: 'Single to deep mid-wicket. SKY works it around.',
            over: 9, ball: 3, batsman: 'S. Yadav', bowler: 'K. Maharaj'
        },
    },
    {
        type: 'BALL',
        payload: {
            runs: 2,
            commentary: 'Two runs! Kohli drives through covers.',
            over: 9, ball: 4, batsman: 'V. Kohli', bowler: 'K. Maharaj'
        },
    },
    {
        type: 'BALL',
        payload: {
            runs: 0,
            commentary: 'Dot ball! Kohli defends the arm ball.',
            over: 9, ball: 5, batsman: 'V. Kohli', bowler: 'K. Maharaj'
        },
    },
    {
        type: 'BALL',
        payload: {
            runs: 1,
            commentary: 'Single to end the over. India building nicely.',
            over: 9, ball: 6, batsman: 'V. Kohli', bowler: 'K. Maharaj'
        },
    },

    {
        type: 'BALL',
        payload: {
            runs: 0,
            commentary: 'Jansen returns! SKY defends the first ball.',
            over: 10, ball: 1, batsman: 'S. Yadav', bowler: 'M. Jansen'
        },
    },
    {
        type: 'BALL',
        payload: {
            runs: 1,
            commentary: 'Single to third man. SKY guides it down.',
            over: 10, ball: 2, batsman: 'S. Yadav', bowler: 'M. Jansen'
        },
    },
    {
        type: 'BOUNDARY',
        payload: {
            runs: 4,
            commentary: 'FOUR! Kohli finds the gap! Drives through extra cover!',
            over: 10, ball: 3, batsman: 'V. Kohli', bowler: 'M. Jansen'
        },
    },
    {
        type: 'BALL',
        payload: {
            runs: 2,
            commentary: 'Two runs! Kohli works it through mid-wicket.',
            over: 10, ball: 4, batsman: 'V. Kohli', bowler: 'M. Jansen'
        },
    },
    {
        type: 'BALL',
        payload: {
            runs: 1,
            commentary: 'Single to long-on. Kohli pushes down the ground.',
            over: 10, ball: 5, batsman: 'V. Kohli', bowler: 'M. Jansen'
        },
    },
    {
        type: 'BOUNDARY',
        payload: {
            runs: 6,
            commentary: 'SIX! SKY finishes the 10th over with a maximum! What a shot!',
            over: 10, ball: 6, batsman: 'S. Yadav', bowler: 'M. Jansen'
        },
    },

    {
        type: 'MATCH_STATUS',
        payload: {
            status: '10 Overs Complete',
            summary: '🏏 After 10 overs: India 92/2. Kohli 35*, SKY 14*. Excellent platform set!'
        },
    },
    {
        type: 'MATCH_STATUS',
        payload: {
            status: 'Simulation Complete',
            summary: '✅ First 10 overs simulation complete! India well placed at 92/2.'
        },
    },
];

function startMockEvents(socket, matchId) {
    let eventIndex = 0;
    let simulationComplete = false;

    console.log(`🏏 Starting India's first 10 overs simulation for ${socket.id}`);

    function sendNextEvent() {
        if (socket.connected && eventIndex < indiaFirst10OversEvents.length && !simulationComplete) {
            const event = {
                ...indiaFirst10OversEvents[eventIndex],
                timestamp: Date.now(),
                id: `ind-10overs-${Date.now()}-${eventIndex}`
            };

            socket.emit('match_event', event);
            console.log(`📨 Sent event to ${socket.id}:`, event.type, '-', event.payload.summary || event.payload.commentary);

            const currentEvent = indiaFirst10OversEvents[eventIndex];
            eventIndex++;

            // If it's the final event, end the simulation
            if (eventIndex === indiaFirst10OversEvents.length) {
                simulationComplete = true;
                console.log(`🏁 Simulation complete for ${socket.id}. Ending session in 5 seconds...`);

                // Send final completion message and disconnect after delay
                setTimeout(() => {
                    socket.emit('match_event', {
                        type: 'MATCH_STATUS',
                        payload: {
                            status: 'Session Ended',
                            summary: '🏁 Simulation complete! Session will end now. Thanks for watching!'
                        },
                        timestamp: Date.now(),
                        id: `session-end-${Date.now()}`
                    });

                    // Disconnect the client after 2 more seconds
                    setTimeout(() => {
                        console.log(`🔚 Ending session for ${socket.id}`);
                        socket.disconnect(true);
                    }, 2000);
                }, 5000);
                return;
            }

            // Calculate dynamic delay based on event type
            let delay = 4000; // Default 2 seconds

            if (currentEvent.type === 'MATCH_STATUS') {
                // Match status events get longer pauses
                if (currentEvent.payload.status === 'Match Started') delay = 3000;
                else if (currentEvent.payload.status === 'Toss Update') delay = 2500;
                else if (currentEvent.payload.status === 'Wicket Fall') delay = 4000; // Longer for wickets
                else if (currentEvent.payload.status === 'Powerplay End') delay = 3500;
                else delay = 2500;
            } else if (currentEvent.type === 'WICKET') {
                // Wickets get dramatic pause
                delay = 3500;
            } else if (currentEvent.type === 'BOUNDARY') {
                // Boundaries get slightly longer pause for excitement
                if (currentEvent.payload.runs === 6) delay = 3000; // Sixes get more time
                else delay = 2500; // Fours get medium time
            } else if (currentEvent.type === 'BALL') {
                // Regular balls vary based on runs
                if (currentEvent.payload.runs === 0) delay = 1800; // Dot balls are quicker
                else if (currentEvent.payload.runs >= 2) delay = 2200; // Multi-run balls get more time
                else delay = 2000; // Singles are normal
            }

            // Add some randomness (±300ms) for natural feel
            const randomVariation = (Math.random() - 0.5) * 600;
            delay += randomVariation;

            // Ensure minimum delay of 1.5 seconds
            delay = Math.max(delay, 1500);

            console.log(`⏱️ Next event in ${Math.round(delay)}ms`);
            setTimeout(sendNextEvent, delay);
        }
    }

    // Start the simulation
    sendNextEvent();

    // Clean up when socket disconnects
    socket.on('disconnect', () => {
        simulationComplete = true;
        console.log(`🏏 10-over simulation stopped for disconnected client`);
    });
}
