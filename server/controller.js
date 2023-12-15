module.exports = app => {
    
    console.log(app);
    const { con } = require('./db.js');
    /*
    const { login, logout, profile, register, loadShop, buyItem, loadInv, updateCoin } = require('./loadItem');

    var router = require("express").Router();

    router.post('/login', login);
    router.post('/logout', logout);
    router.post('/profile', profile);
    router.post('/register', register);
    router.get('/loadShop', loadShop);
    router.post('/buyItem', buyItem);
    router.post('/loadInv', loadInv);
    router.post('/updateCoin', updateCoin);
    */
   
    /*
     *
     * Login, Logout, Register
     * 
     */

    app.post('/login', (req, res) => {

        const { email, password } = req.body;
        // console.log(req.body)
        // const query = `SELECT * FROM user_profile WHERE email = '${email}' AND  password = '${password}'`;
        const query = `SELECT * FROM user_profile 
                        INNER JOIN leaderboard 
                        ON user_profile.user_id = leaderboard.user_id 
                        INNER JOIN pet
                        ON user_profile.user_id = pet.user_id
                        WHERE email = '${email}' AND  password = '${password}'`;
        
        con.query(query, [email, password], (err, results) => { //the second attr is for to prevent SQL injection
            if (err) {
                console.error(err);
                return res.status(500).send('An error occurred.');
            }

            if (results.length > 0) {
                //console.log(c);
                console.log('Login success');
                var inv_array = null;
                if(results[0].inventory !== null && results[0].inventory !== '') {

                    inv_array = results[0].inventory.split(',');
                    console.log(inv_array);         

                }

                req.session.user = {
                    id: results[0].user_id,
                    user: results[0].username,
                    coin: results[0].coin,
                    inv: inv_array,
                    score: {
                        tictactoe: results[0].tictactoe,
                        platformer: results[0].platformer,
                        mazegame: results[0].mazegame
                    },
                    pet: {
                        pet_name: results[0].pet_name,
                        growth: results[0].growth,
                        hunger: results[0].hunger,
                        clean: results[0].clean,
                        hair: results[0].hair,
                        happiness: results[0].happiness,
                        nail: results[0].nail,
                        pet_type: results[0].pet_type
                    }
                }
                console.log(req.session.user);
                res.send(req.session.user);
            } else {
                console.log('Login failed');
                res.send('Login failed. Invalid username or password.');
            }
        });
    });

    app.post('/logout',(req,res) => {
        console.log('logout Connected')
        if (req.session.user) {
            req.session.destroy();
            //console.log(req.session);
            res.send('Logged out');
        } else {
            res.send('Not logged in');
        }
    });

    app.post('/getProfile', (req, res) => {
        console.log("getProfile Connected");
        if (req.session.user) {
            console.log('Profile loaded')
            console.log(req.session);
            const user = req.session.user;
            res.send(user);
        } else {
            console.log('Cannot load profile')
            res.send('User not logged in');
        }
    });


    app.post('/register', (req, res) => {
        console.log("loadRegister Connected");
        console.log(req.body);
        const { username, email, password } = req.body;

        let getUserId;

        if(
            username !== null && password !== null && email !== null &&
            username !== '' && password !== '' && email !== '' 
            ) {

            // Check if the username or email already exists in the database
            const checkQuery = `SELECT * FROM user_profile WHERE username = '${username}' OR email = '${email}'`;
            con.query(checkQuery, [username, email], (err, results) => {
                if (err) {
                    console.error(err);
                    res.send(`Registration failed: ${err}`);
                } else if (results.length > 0) {
                    res.send('Username or email already exists. Please choose a different one.');
                } else {
                    // Insert user data into the database
                    const user = { username, password, email };
                    const insertQuery = `INSERT INTO user_profile (username, email, password, coin)
                                        VALUES ('${username}', '${email}', '${password}', 1000)
                                        `;

                    return new Promise ((resolve, reject) => {
                        con.query(insertQuery, user, (err, result) => {
                            if (err) {
                                console.error(err);
                                //res.send(`Registration failed: ${err}`);
                                reject(`Registration failed: ${err}`)
                            } else {
                                console.log('Registration successful');
                                //res.send('Registration successful');
                                resolve();
                            }
                        });

                    })
                    .then(() => {

                        // const query = 'SELECT user_id FROM user_profile ORDER BY user_id DESC LIMIT 1';
                        const query = `SELECT user_id FROM user_profile WHERE username = '${username}'`;

                        return new Promise ((resolve,reject) => {
                            con.query(query, (error, results, fields) => {
                                // if (error) throw new Error(error);
                                if (error) {
                                    reject("getUserId failed");
                                }
                                else {
                                    getUserId = results[0].user_id;
                                    console.log('This user\'s ID is: ', getUserId);
                                    resolve();
                                }
                            })
                        })
                        

                    })
                    .then(() => {
                        
                        const leaderboardQuery = `INSERT INTO leaderboard 
                                                VALUES (${getUserId}, 0, 0, 0)
                                                `;
                        return new Promise ((resolve, reject) => {
                            con.query(leaderboardQuery, (err, result) => {
                                if (err) {
                                    console.error(err);
                                    //res.send(`Registration failed: ${err}`);
                                    // throw new Error(`Leaderboard creation failed: ${err}`)
                                    reject(`leaderboard failed: ${err}`);
                                } else {
                                    console.log('Leaderboard successful');
                                    resolve();
                                    // res.send('Registration successful');
                                }
                            });
                        });
                        

                    })
                    .then(() => {

                        const petInitQuery = `INSERT INTO pet 
                                                VALUES (${getUserId}, "Kitty", 0, 0, 0, 0, 0, 0, "cat1")
                                                `;
                        return new Promise((resolve, reject) => {
                            con.query(petInitQuery, (err, result) => {
                                if (err) {
                                    console.error(err);
                                    // res.send(`Registration failed: ${err}`);
                                    // throw new Error(`petInit failed: ${err}`)
                                    reject(`petInit failed: ${err}`)
                                } else {
                                    resolve();
                                    console.log('PetInit successful');
                                }
                            });
                        })
                        

                    })
                    .then(() => {
                        
                        console.log("3 insertion complete");
                        res.send('Registration successful');

                    })
                    .catch(result => {
                        console.log(result);
                        res.send(JSON.stringify(result));
                    });
                }
            });
        } else {
            res.send('Please fill in all the blanks');
        }
    });

    /*
    *
    * Shop
    * 
    */

    app.get('/getShop', (req, res) => {
    
        console.log("getShop Connected!");
        var sql_get_item = "SELECT * FROM item";

        con.query(sql_get_item, function (err, result, fields) {
            if (err) throw(err);
            else res.json(result);
        });
    });


    app.post('/buyItem', (req, res) => {
    
        const { item_id, cost } = req.body;
        
        //TO DO: Check if user have enough coins

        if (req.session.user) {
            
            let invArray = req.session.user.inv;
            let duplicate = new Promise ((res, rej) => {

                if(invArray !== null && invArray !== '') {
                    console.log("check duplicate");
                    invArray.forEach(owned => {
                    if(owned == item_id) rej('Already owned this item')
                    });
                    res();
                } else {
                    res();
                }
            })
            .then(()=>{

                updateCoin(req, -cost)
                .then((result)=> {

                    console.log('updating inventory');
                    let newInv;

                    if(invArray !== null && invArray !== '') {
                        newInv = invArray.join(',');
                        newInv += `,${item_id}`;
                    } else {
                        newInv = `${item_id}`;
                    }
                    
                    const updateInv = `UPDATE user_profile
                                    SET inventory = '${newInv}'
                                    WHERE user_id = ${req.session.user.id}`;
                    con.query(updateInv, function (err, result, fields) {
                        //console.log(result);
                        if (err) throw(err);
                        else console.log('Updated DB Inventory');
                    });
                    return(newInv)

                })
                .then((result)=> {
                    req.session.user.inv = result.split(',');
                    req.session.save((err) => {
                    if (err) {
                        res.status(500).send('Error updating session');
                    } else {
                        console.log('Session update inv successfully')
                        return
                    }
                    });
                    console.log(req.session.user);
                })
                .then((result)=> {
                    console.log('Successful purchase!'); 
                    res.send('Successful purchase!');
                });

            })
            .catch((result)=> {
                console.log('item owned');
                res.send(result);
            });
            

        } else {
            res.send('User not logged in');
        }

    });

    /*
     *
     * Load user inventory
     * 
     */

    app.post('/getInv', (req, res) => {

        console.log("getInv Connected!");
        
        if (req.session.user) {

            let inv_array = req.session.user.inv;
            //console.log(inv_array)
            //console.log(inv_array.length)

            if(inv_array !== null && inv_array !== '') {

            var sql_get_item = `SELECT * FROM item WHERE item_id = `;

            for (let i = 0 ; i < inv_array.length ; i++) {

                if(inv_array.length == 1) {

                sql_get_item += `${inv_array[i]}`;

                } else {

                if(inv_array.length - i == 1) {

                    sql_get_item += `${inv_array[i]}`;

                } else {

                    sql_get_item += `${inv_array[i]} OR item_id = `;

                }

                }
            }

            console.log(sql_get_item);

            con.query(sql_get_item, function (err, result, fields) {
                console.log(result);
                if (err) throw(err);
                else res.send(result);
            });

            } else {
            
            res.send(`Inventory no item`);

            }

        } else {
            console.log('User not logged in')
            res.send('User not logged in');

        }

    });

    /*
     *
     * update coin
     * 
     */

    function updateCoin (req, cost) {
        console.log('updateCoin connected')
        
        let curCoin = req.session.user.coin;
        let newCoin = curCoin + cost;
        req.session.user.coin = newCoin;

        const updateCoin = `UPDATE user_profile
                            SET coin = ${newCoin}
                            WHERE user_id = ${req.session.user.id}`;

        return new Promise ((resolve, reject) => {
            con.query(updateCoin, function (err, result, fields) {
                //console.log(result); 
                if (err) reject(err);
                else resolve(console.log('DB update coin successfully'))
            })
        })
        .then(()=> {
            return new Promise ((resolve, reject) => {
                req.session.save((err) => {
                    if (err) {
                        res.status(500).send('Error updating session');
                    } else {
                        resolve(console.log('Session update coin successfully'));
                    }
                });
            });
            
        })
        // .then(()=> {
        //     console.log(newCoin)      
        //     return(newCoin); 
        // })
        .catch((err)=> {
            throw(err);
        });
        // return(updateDB);        
    }

    app.post('/updateCoin', (req, res) => {

        console.log("updateCoin Connected!");
        let coin = parseInt(req.body.coin, 10);
        console.log(typeof coin)
        
        if (req.session.user) {
            
            return new Promise ((resolve, reject) => {
                updateCoin(req, coin)
                resolve();
            })
            .then(() => {
                res.send("Success update coin");
            })

        } else {

            res.send('User not logged in');

        }

    });

    app.post('/getLeaderboard', (req, res) => {

        console.log(req.body.game)
        console.log("getLeaderboard Connected!");
        let game = req.body.game
        const getLeaderboard = `SELECT * FROM leaderboard 
                                INNER JOIN user_profile 
                                ON leaderboard.user_id = user_profile.user_id
                                ORDER BY ${game} DESC
                                LIMIT 5;`;

        con.query(getLeaderboard, function (err, result, fields) {
            if (err) throw(err);
            else res.json(result);
        });

    });

    app.post('/setLeaderboard', (req, res) => {

        let game = req.body.game
        let point = req.body.point
        console.log("setLeaderboard Connected!");
        
        if (req.session.user) {
            let user_id = req.session.user.id
            //console.log(req.session.user)

            const getLeaderboard = `SELECT * FROM leaderboard 
                                    WHERE user_id = ${user_id}`;

            con.query(getLeaderboard, function (err, result, fields) {
                if (err) throw(err);
                else {
                    switch(game) {
                        case "mazegame":
                            console.log(result)
                            console.log(result[0].mazegame);
                            if (point > result[0].mazegame) {
                                const setLeaderboard = `UPDATE leaderboard 
                                                        SET mazegame = ${point}
                                                        WHERE user_id = ${user_id}`;
                                con.query(setLeaderboard, function (err, result, fields) {
                                    if (err) throw(err);
                                    else console.log (`${user_id} gain new high score`);
                                });
                            }
                            break;
                        case "platformer":
                            console.log(result)
                            console.log(result[0].platformer);
                            if (point > result[0].platformer) {
                                const setLeaderboard = `UPDATE leaderboard 
                                                        SET platformer = ${point}
                                                        WHERE user_id = ${user_id}`;
                                con.query(setLeaderboard, function (err, result, fields) {
                                    if (err) throw(err);
                                    else console.log (`${user_id} gain new high score`);
                                });
                            }
                            break;
                        case "tictactoe":
                            break;
                        
                    }

                }
                
                res.json(result);
            });
        } else {
            res.send('User not logged in');
        }
    });

    /*
     *
     * Pet
     * 
     */

    app.post('/getPet', (req, res) => {

        console.log("getPet Connected");

        if (req.session.user) {
            console.log('getPet loaded')
            const pet = req.session.user.pet;
            res.send(pet);
        } else {
            console.log('Cannot get pet')
            res.send('Cannot get pet');
        }
    })

    
    app.post('/setPet', (req, res) => {

        console.log("setPet Connected");
        
        if (req.session.user) {
            let action = req.body.action;
            let user_id = req.session.user.id;
            let query;
            //console.log(req.session.user)
            if(action == "setName") {
                return new Promise ((resolve, reject) => {
                    let newName = req.body.newName;
                    query = `UPDATE pet
                            SET pet_name = '${newName}' 
                            WHERE user_id = ${user_id}`;
                    req.session.user.pet.pet_name = newName;
                    resolve("Set name successful");
                })
                .then((msg) => {
                    
                    return new Promise ((resolve, reject) => {
                        con.query(query, function (err, result, fields) {
                            if (err) reject(err);
                            resolve(msg);
                        });
                    });
                })
                .then((msg) => {
                    console.log(msg)
                    res.send(msg);
                })
                .catch((err) => {
                    res.send("Error: " + err);
                })
            } else {
                res.send(setPetStatus(user_id, action));
            }
            
        } else {

            res.send('User not logged in');

        }
    });

    // Growth (if happiness < 50, growth +10, 
    //            happiness > 50, growth +20, 
    //            happiness > 80, growth +30)

    // When fed, clean, trimmed, respectively become 100, and happiness +50 at the same time
    function setPetStatus (user_id, action) {
        console.log("entered setpetstatus")
        let query;
        let happiness;
        
        return new Promise ((resolve, reject) => {
            let getHappiness = `SELECT happiness FROM pet WHERE user_id = ${user_id}`;
            con.query(getHappiness, function (err, result, fields) {
                if (err) reject(err);
                happiness = result[0].happiness;

                (happiness + 50 > 100) ? happiness = 100 : happiness += 50;
                resolve();
            });
        })
        .then(() => {
            
            return new Promise ((resolve, reject) => {
                let setHappiness = `UPDATE pet
                                    SET happiness = ${happiness}
                                    WHERE user_id = ${user_id}`;
                con.query(setHappiness, function (err, result, fields) {
                    if (err) reject(err);
                    console.log("Success set happiness");
                    resolve();
                });
            });

        })
        .then(() => {
            
            switch (action) {                
                case "hunger":
                    query = `UPDATE pet
                            SET hunger = 100
                            WHERE user_id = ${user_id}`;
                    setGrowth(user_id, happiness);
                break;
                case "clean":
                    query = `UPDATE pet
                            SET clean = 100
                            WHERE user_id = ${user_id}`;
                break;
                case "hair":
                    query = `UPDATE pet
                            SET hair = 100
                            WHERE user_id = ${user_id}`;
                break;
                case "nail":
                    query = `UPDATE pet
                            SET nail = 100
                            WHERE user_id = ${user_id}`;
                break;
            }
            return new Promise ((resolve, reject) => {
                con.query(query, function (err, result, fields) {
                    if (err) reject(err);
                    
                    console.log("Success set " + action);
                    resolve("Success set " + action);

                });
            });
        })
        .catch((msg)=> {
            return msg;
        })
    }

    function setGrowth (user_id, happiness) {
        let getGrowth = `SELECT growth FROM pet WHERE user_id = ${user_id}`;
        let growth;

        console.log("Enter setgrowth")

        return new Promise ((resolve, reject) => {
            con.query(getGrowth, function (err, result, fields) {
                if (err) reject(err);
                growth = result[0].growth;

                if(happiness < 50) growth += 10;
                else if (happiness > 50 && happiness < 80) growth += 20;
                else if (happiness > 80) growth += 30;

                if(growth > 100) growth = 100;
                console.log("new growth : " + growth);
                resolve();
            });
        })
        .then(() => {
            let setGrowth = `UPDATE pet
                            SET growth = ${growth}
                            WHERE user_id = ${user_id}`;

            con.query(setGrowth, function (err, result, fields) {
                if (err) reject(err);
                console.log("Success setgrowth");
                return;
            });
        })
        .catch((err)=> {
            console.log(err)
            return err;
        })
    }

    function decrementPetStatus() {
        console.log("Decrement pet status")
        let query = 'SELECT * FROM pet';
        con.query(query, (err, results) => {
            if (err) {
                console.error('Error executing MySQL query:', err);
                return;
            }
            // Loop through the results
            for (const row of results) {
                con.query(`UPDATE pet SET 
                happiness = IF(happiness <= 0, 0, happiness - 10) ,
                hunger = IF(hunger <= 0,  0, hunger - 10) ,
                clean = IF(clean <= 0, 0, clean - 10) ,
                hair = IF(hair <= 0, 0, hair - 10) ,
                nail = IF(nail <= 0, 0, nail - 10) 
                WHERE user_id = ${row.user_id};`);
            }
        });
      }
    
      // Decrement pet status every minute
      setInterval(decrementPetStatus, 60000);

}