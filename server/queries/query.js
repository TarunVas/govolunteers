const Pool = require('pg').Pool
const pool = new Pool({
    user: 'tarun',
    host: 'localhost',
    database: 'volunteerdb',
    password: 'dioo',
    port:5432,
})
const getVolunteers = (request, response) => {
    pool.query('SELECT * FROM tbl_volunteer ORDER BY id asc', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}
const createVolunteer = (request, response) => {
    const {fname, lname, username, password, email, phonenumber}= request.body
        pool.query('INSERT INTO tbl_volunteer (fname, lname, username, password, email, phonenumber) VALUES($1,$2,$3,$4,$5,$6)', [fname, lname, username, password, email, phonenumber], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send('User added with ID: ${results.insertId')

    })
    }
    const getVolunteerbyId = (request, response) => {
        const id = parseInt(request.params.id)
        pool.query('SELECT * FROM tbl_volunteer WHERE id = $1', [id], (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).json(results.rows)
        })
        }
        module.exports = {
            getVolunteers,
            createVolunteer,
            getVolunteerbyId
        }