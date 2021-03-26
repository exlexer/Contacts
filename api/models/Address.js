const { db } = require('../lib');

class Address {
  constructor({
    line1, line2, city, state, country,
  }, id) {
    this.line1 = line1;
    this.line2 = line2;
    this.city = city;
    this.state = state;
    this.country = country;
    this.id = +id;
  }

  store(contactId) {
    return new Promise((resolve, reject) => {
      if (this.id) reject(new Error('address already stored'));
      const text = `
        insert into addresses
          (contact_id, line_1, line_2, city, state, country)
        values ($1, $2, $3, $4, $5, $6)
        returning id
      `;

      const params = [contactId, this.line1, this.line2, this.city, this.state, this.country];

      db.query(text, params)
        .then(({ id }) => {
          this.id = id;
          resolve(id);
        })
        .catch(err => reject(err));
    });
  }

  update({
    line1, line2, city, state, country,
  }) {
    return new Promise((resolve, reject) => {
      const text = `
        update addresses set
          line_1 = $1,
          line_2 = $2,
          city = $3,
          state = $4,
          country = $5
        where id = $6`;

      const params = [
        line1 || this.line1,
        line2 || this.line2,
        city || this.city,
        state || this.state,
        country || this.country,
        this.id,
      ];

      db.query(text, params)
        .then(() => resolve())
        .catch(err => reject(err));
    });
  }

  static getById(id) {
    return new Promise((resolve, reject) => {
      db.query(
        'select line_1 line1, line_2 line2, city, state, country from addresses where id = $1',
        [id],
      )
        .then(address => resolve(new Address(address, id)))
        .catch(err => reject(err));
    });
  }

  static delete(id) {
    return db.query('delete from addresses where id = $1', [id]);
  }
}

module.exports = Address;

