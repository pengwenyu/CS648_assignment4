/* global db print */
/* eslint no-restricted-globals: "off" */
db.issues.remove({});

const issueDB = [
  {
    id: 1,
    name: 'Shirts1',
    price: 150,
    category: 'Shirts',
    image: 'https://www.vistaprint.com/clothing-bags/mens-t-shirts/basic-t-shirts?couponAutoload=1&GP=03%2f09%2f2020+16%3a34%3a15&GPS=5639570096&GNF=0',
  },
  {
    id: 2,
    name: 'Jeans1',
    price: 50,
    category: 'Jeans',
    image: 'https://www.amazon.com/Childrens-Place-Boys-Straight-Jeans/dp/B01MSRE9W',
  },
];

db.issues.insertMany(issueDB);
const count = db.issues.count();
print('Inserted', count, 'issues');
db.counters.remove({ _id: 'issues' });
db.counters.insert({ _id: 'issues', current: count });
db.issues.createIndex({ id: 1 }, { unique: true });
db.issues.createIndex({ name: 1 });
db.issues.createIndex({ price: 1 });
