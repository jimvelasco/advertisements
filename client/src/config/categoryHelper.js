const categories = {
  Food: [],
  Nightlife: [],
  Coffee: [],
  Fun: [],
  Rental: []
};

const categoryHelper = {
  getCat0: function() {
    let cary = Object.keys(categories);
    return cary;
  },
  getCat1: function(which) {
    return categories[which];
  }
};

// const func = which => {
//   return lists[which];
// };

export default categoryHelper;
