const { render } = require("express/lib/response");
const mysql = require("mysql");

//connection pool
let pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// home page
exports.home = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err; //not connected
    console.log("connected to db" + connection.threadId);

    res.render("home");
  });
};

//admin page
exports.admin = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err; //not connected
    console.log("connected to db" + connection.threadId);

    res.render("admin");
  });
};

//register page
exports.register = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err; //not connected
    console.log("connected to db" + connection.threadId);

    res.render("register");
    console.log("registering");
  });
};

//registration
exports.registration = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err; //not connected
    console.log("connected to db" + connection.threadId);

    console.log(req.body);

    const name = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const passwordConfirm = req.body.passwordConfirm;

    //verifying from db
    connection.query(
      "SELECT email from user where email=?",
      [email],
      (error, results) => {
        if (error) {
          console.log(error);
        }

        if (results.length > 0) {
          return res.render("register", {
            message: "Email already in Use!",
          });
        } else if (password != passwordConfirm) {
          return res.render("register", {
            message: "Passwords Dont Match!",
          });
        }
        console.log("hello i am there");

        connection.query(
          "INSERT into user SET ?",
          { username: name, email: email, password: password },
          (error, result) => {
            if (error) console.log(error);
            else
              return res.render("register", {
                message: "Registation Sucessfull",
              });
          }
        );
      }
    );
  });
};

//log in
exports.login = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err; //not connected
    console.log("connected to db" + connection.threadId);

    res.render("login");
  });
};

//Logging in
exports.loggingIn = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err; //not connected
    console.log("connected to db login" + connection.threadId);

    console.log(req.body);

    const email = req.body.email;
    const password = req.body.password;
    //verifying from db
    connection.query(
      "SELECT email,password from user where email=? and password=?",
      [email, password],
      (error, results) => {
        if (error) {
          console.log(error);
        }
        console.log(results.length);
        if (results.length == 1) {
          return res.render("admin2");
        } else {
          return res.render("login", {
            message: "Wrong Email or Password",
          });
        }
      }
    );
  });
};

//team View
exports.viewteam = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err; //not connected
    console.log("connected to db" + connection.threadId);

    //use the connection
    connection.query("select * from team", (err, rows) => {
      //when done with connection release it
      connection.release();
      if (!err) {
        res.render("team", { rows });
      } else {
        console.log(err);
      }
    });
  });
};

//Umpire View
exports.viewumpire = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err; //not connected
    console.log("connected to db" + connection.threadId);

    //use the connection
    connection.query("select * from umpire", (err, rows) => {
      //when done with connection release it
      connection.release();
      if (!err) {
        res.render("umpire", { rows });
      } else {
        console.log(err);
      }
    });
  });
};

//Score View
exports.viewscore = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err; //not connected
    console.log("connected to db" + connection.threadId);

    //use the connection
    connection.query("SELECT * from team ORDER BY team_rank", (err, rows) => {
      //when done with connection release it
      connection.release();
      if (!err) {
        res.render("score", { rows });
      } else {
        console.log(err);
      }
    });
  });
};

//match details
exports.viewmatch = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err; //not connected
    console.log("connected to db" + connection.threadId);

    //use the connection
    connection.query("SELECT * from matches ", (err, rows) => {
      //when done with connection release it
      connection.release();
      if (!err) {
        res.render("match_details", { rows });
      } else {
        console.log(err);
      }
    });
  });
};

//TeamPlayers View
exports.viewteamplayers = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err; //not connected
    console.log("connected to db" + connection.threadId);

    // User the connection
    connection.query(
      "SELECT * FROM players where pteam_id=?",
      [req.params.team_id],
      (err, rows) => {
        connection.release();

        if (!err) {
          console.log("player team");
          res.render("teamplayers", { rows });
        } else {
          console.log(err);
        }
      }
    );

    connection.query(
      "CREATE or Replace VIEW vplayer(vplayer_id) AS SELECT player_id FROM players WHERE pteam_id=?",
      [req.params.team_id],
      (error, result) => {
        console.log("view created");
        if (error) console.log(error);
      }
    );
  });
};

//Batsmen View
exports.viewbatsmen = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err; //not connected
    console.log("connected to db" + connection.threadId);

    // User the connection
    connection.query(
      "SELECT distinct * FROM batsmen,players WHERE batsmen.player_id IN (SELECT  vplayer_id FROM vplayer) and batsmen.player_id=players.player_id",

      (err, rows) => {
        connection.release();
        if (!err) {
          res.render("batsmen", { rows });
        } else {
          console.log(err);
        }
      }
    );
  });
};

//Bowler View
exports.viewbowler = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err; //not connected
    console.log("connected to db" + connection.threadId);

    // User the connection
    connection.query(
      "SELECT distinct * FROM bowler,players WHERE bowler.player_id IN (SELECT  vplayer_id FROM vplayer) and bowler.player_id=players.player_id",

      (err, rows) => {
        connection.release();
        if (!err) {
          res.render("bowler", { rows });
        } else {
          console.log(err);
        }
      }
    );
  });
};

//ViewAllRounder
exports.allrounder = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err; //not connected
    console.log("connected to db alrounder table " + connection.threadId);

    // User the connection
    connection.query(
      "SELECT * FROM batsmen join bowler on batsmen.player_id=bowler.player_id ",
      // "SELECT * from batsmen , bowler WHERE batsmen.player_id=bowler.player_id",

      (err, rows) => {
        connection.release();
        if (!err) {
          console.log(rows);
          res.render("allrounder", { rows });
        } else {
          console.log(err);
        }
      }
    );
  });
};

//Search For teamplayer
exports.find = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err; //not connected
    console.log("connected to find db" + connection.threadId);

    let searchItem = req.body.search;
    console.log(searchItem);
    console.log("hello");

    connection.query(
      "SELECT * FROM players WHERE pname LIKE ?",
      ["%" + searchItem + "%"],
      (err, rows) => {
        //When done with connection release it
        connection.release();
        if (!err) {
          res.render("teamplayers", { rows });
        } else {
          console.log(err);
        }
      }
    );
  });
};

// admin team View
exports.admin_team = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err; //not connected
    console.log("connected to db" + connection.threadId);

    //use the connection
    connection.query("select * from team", (err, rows) => {
      //when done with connection release it
      connection.release();
      if (!err) {
        res.render("admin_team", { rows });
      } else {
        console.log(err);
      }
    });
  });
};

//Admin TeamPlayers View
exports.admin_player = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err; //not connected
    console.log("connected to db" + connection.threadId);

    // User the connection
    connection.query(
      "SELECT * FROM players where pteam_id=?",
      [req.params.team_id],
      (err, rows) => {
        connection.release();

        if (!err) {
          console.log("player team");
          res.render("admin_player", { rows });
        } else {
          console.log(err);
        }
      }
    );
  });
};

exports.edit_player = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err; //not connected
    console.log("connected to db" + connection.threadId);
    
    pool.getConnection((err,connection) =>{
      if(err) throw err;
      console.log("connected to edit player");
      
      connection.query("select * from players where player_id=?",[req.params.player_id],
      (err,rows) => {
        connection.release();
        if(!err){
          console.log("editing")
          res.render('edit_player',{rows});
        }
        else
        console.log(err);
      })

    })
    
  });
};
//edit player details
// exports.edit_player = (req, res) => {
//   console.log("edit page");

//   pool.getConnection((err, connection) => {
//     if (err) throw err; //not connected
//     console.log("connected to db edit" + connection.threadId);

//     // User the connection
//     connection.query(
//       "SELECT * FROM players where player_id=?",
//       [req.params.player_id],
//       (err, rows) => {
//         connection.release();

//         if (!err) {
//           console.log("player team edit");
//           res.render("edit_player", { rows });
//         } else {
//           console.log(err);
//         }
//       }
//     );
//   });
// };

//update player
exports.update_player = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err; //not connected
    console.log("connected to update player table" + connection.threadId);

    console.log(req.body);

    const player_id = req.body.player_id;
    const pname = req.body.pname;
    const no_of_odi = req.body.no_of_odi;
    const no_of_t20 = req.body.no_of_t20;
    const no_of_test = req.body.no_of_test;

    //verifying from db
    connection.query("UPDATE players SET no_of_t20  = ?,  no_of_odi = ?, no_of_test = ?, pname = ? WHERE player_id = ?",
      [no_of_t20, no_of_odi, no_of_test, pname, player_id],
      (error, results) => {
        if (error) {
          console.log(error);
        }
        connection.query("SELECT * FROM players WHERE player_id = ?", [player_id],
          (error, rows) => {
            if (error) console.log(error);
            else
              return res.render("edit_player", {
                rows,
                alert: `${pname} has been updated.`,
              });
          }
        );
      }
    );
  });
};

//newww
// exports.update_player = (req, res) => {
//   console.log("so far no error");
//   const { player_id,pname,no_of_t20,no_of_odi,no_of_test } = req.body;
//   console.log("updating");
//   // User the connection
//   connection.query(
//     "UPDATE players SET no_of_t20  = ?,  no_of_odi = ?, no_of_test = ?, pname = ? WHERE player_id = ?",
//     [no_of_t20, no_of_odi, no_of_test, pname, player_id],
//     (err, rows) => {
//       if (!err) {
//         pool.getConnection((err, connection) => {
//           if (err) throw err;
//           console.log("updating");
//           connection.query(
//             "SELECT * FROM players WHERE player_id = ?",
//             [player_id],
//             (err, rows) => {
//               connection.release();
//               if (!err) {
//                 res.render("edit_players", {
//                   rows,
//                   alert: `${pname} has been updated.`,
//                 });
//               } else {
//                 console.log(err);
//               }
//               console.log("The data from user table: \n", rows);
//             }
//           );
//         });
//       } else {
//         console.log(err);
//       }
//       console.log("The data from user table: \n", rows);
//     }
//   );
// };

// exports.update_player = (req, res) => {
//   var { player_id, pname, no_of_t20, no_of_odi, no_of_test} = req.body;
//   console.log(req.body);
//   // User the connection
//   connection.query('UPDATE players SET pname = ?, no_of_t20 = ?, no_of_odi = ?, no_of_test = ? WHERE player_id = ?', [pname, no_of_t20, no_of_odi, no_of_test, req.params.player_id], (err, rows) => {

//     if (!err) {
//       // User the connection
//       connection.query('SELECT * FROM players WHERE player_id = ?', [player_id], (err, rows) => {
//         // When done with the connection, release it

//         if (!err) {
//           res.render('delete', { rows, alert: `${pname} has been updated.` });
//         } else {
//           console.log(err);
//         }
//         console.log('The data from user table: \n', rows);
//       });
//     } else {
//       console.log(err);
//     }
//     console.log('The data from user table: \n', rows);
//   });
// };

//enter details

exports.form = (req, res) => {
  res.render("add_players");
  console.log("enter details");
};

//add players
exports.add_players = (req, res) => {
  const player_id = req.body.player_id;
  const team_id = req.body.team_id;
  const pname = req.body.pname;
  const no_of_odi = req.body.no_of_odi;
  const no_of_t20 = req.body.no_of_t20;
  const no_of_test = req.body.no_of_test;

  console.log(req.body);

  console.log("player adding");
  pool.getConnection((err, connection) => {
    if (err) throw err; //not connected
    console.log("connected to db" + connection.threadId);

    // User the connection
    connection.query(
      "INSERT into players set player_id=? , pname = ? , no_of_odi =? , no_of_test=? , no_of_t20 =? ,pteam_id= ? "[
      (player_id, pname, no_of_odi, no_of_test, no_of_t20, team_id)
      ],
      (err, rows) => {
        connection.release();

        if (!err) {
          console.log("player inserted");
          res.render("add_player", { rows });
        } else {
          console.log(err);
        }
        console.log("player added");
      }
    );
  });
};

//delete players
exports.delete = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err; //not connected
    console.log("connected to db" + connection.threadId);

    //use the connection
    connection.query(
      "DELETE from TEAM where team_id=?",
      [req.params.team_id],
      (err, rows) => {
        //when done with connection release it
        connection.release();
        if (!err) {
          res.render("delete");
          console.log("deleted");
        } else {
          console.log(err);
        }
      }
    );
  });
};
