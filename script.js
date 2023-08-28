let conversionFactors;

fetch('conversionFactors.json')
  .then(response => response.json())
  .then(data => {
    conversionFactors = data;
  })
  .catch(error => {
    console.error('Error fetching conversion factors:', error);
  });

const categoryDropdown = document.getElementById('choose-category');
const fromDropdown = document.getElementById('from-unit');
const toDropdown = document.getElementById('to-unit');
const results = document.getElementById('results');

categoryDropdown.addEventListener('click', () => {
  populateDropdown(categoryDropdown, Object.keys(conversionFactors));
});

fromDropdown.addEventListener('click', () => {
  const selectedCategory = categoryDropdown.querySelector('.selected').textContent;
  if (selectedCategory) {
    populateDropdown(fromDropdown, Object.keys(conversionFactors[selectedCategory]));
  }
});

toDropdown.addEventListener('click', () => {
  const selectedCategory = categoryDropdown.querySelector('.selected').textContent;
  if (selectedCategory) {
    populateDropdown(toDropdown, Object.keys(conversionFactors[selectedCategory]));
  }
});

function populateDropdown(dropdown, items) {
  const dropdownContent = dropdown.querySelector('.dropdown-content');
  dropdownContent.innerHTML = '';

  items.forEach(item => {
    const option = document.createElement('span');
    option.textContent = item;
    option.classList.add('values');
    option.addEventListener('click', () => {
      const selectedText = option.textContent;
      const selectedDropdown = dropdown.querySelector('.selected');
      selectedDropdown.textContent = selectedText;
      dropdownContent.classList.remove('open');
      if (dropdown === fromDropdown || dropdown === toDropdown) {
        updateUnitDropdowns(selectedText);
      }
    });
    dropdownContent.appendChild(option);
  });

  dropdownContent.classList.add('open');
  dropdown.classList.toggle("active");
}

function updateUnitDropdowns(selectedCategory) {
  const units = conversionFactors[selectedCategory] ? Object.keys(conversionFactors[selectedCategory]) : [];
  populateDropdown(fromDropdown, units);
  populateDropdown(toDropdown, units);
}

document.getElementById('convert').addEventListener('click', () => {
  const inputValue = parseFloat(document.getElementById('user-value').value);
  const fromCategory = categoryDropdown.querySelector('.selected') ? categoryDropdown.querySelector('.selected').textContent : '';
  const fromUnit = fromDropdown.querySelector('.selected') ? fromDropdown.querySelector('.selected').textContent : '';
  const toUnit = toDropdown.querySelector('.selected') ? toDropdown.querySelector('.selected').textContent : '';

  if (fromCategory && fromUnit && toUnit && conversionFactors[fromCategory] && conversionFactors[fromCategory][fromUnit] && conversionFactors[fromCategory][fromUnit][toUnit]) {
    const conversionFactor = conversionFactors[fromCategory][fromUnit][toUnit];
    const convertedValue = inputValue * conversionFactor;

    results.innerHTML = `
    ${inputValue} ${fromUnit} = ${convertedValue.toFixed(2)} ${toUnit}
    `;
  } else {
    results.innerHTML = 'Invalid conversion';
  }
});

const dropdowns = document.querySelectorAll('.custom-dropdown');

dropdowns.forEach(dropdown => {
  const dropdownContent = dropdown.querySelector('.dropdown-content');
  const items = dropdownContent.querySelectorAll('.values');

  items.forEach(item => {
    item.addEventListener('click', () => {
      const selectedText = item.textContent;
      const selectedDropdown = dropdown.querySelector('.selected');
      selectedDropdown.textContent = selectedText;
    
      dropdownContent.classList.remove('open');
    });
  });


  document.addEventListener('click', event => {
    if (!dropdown.contains(event.target)) {
      dropdownContent.classList.remove('open');
    }
  });
});


document.getElementById('reset').addEventListener('click', () => {
  const selectedDropdowns = document.querySelectorAll('.custom-dropdown .selected');
  selectedDropdowns.forEach(selectedDropdown => {
    selectedDropdown.textContent = 'Choose';

  });

  document.getElementById('user-value').value = '0';
  results.innerHTML = '0';
});

