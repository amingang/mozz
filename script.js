let members = JSON.parse(localStorage.getItem('trip_members')) || ['ارسلان', 'شهاب', 'امین'];
let items = JSON.parse(localStorage.getItem('trip_items')) || [
    { name: 'چادر مسافرتی', ready: false },
    { name: 'کیسه‌خواب', ready: true }
];
let expenses = JSON.parse(localStorage.getItem('trip_expenses')) || [
    { title: 'رفت و برگشت', amount: 5000000, category: 'حمل‌ونقل', payer: 'علی' },
    { title: 'هتل', amount: 3000000, category: 'اقامت', payer: 'رضا' }
];

function saveData() {
    localStorage.setItem('trip_members', JSON.stringify(members));
    localStorage.setItem('trip_items', JSON.stringify(items));
    localStorage.setItem('trip_expenses', JSON.stringify(expenses));
}


function renderMembers() {
    const memberList = document.getElementById('member-list');
    const cardsContainer = document.getElementById('members-cards-container');
    const countText = document.getElementById('member-count-text');

    if (cardsContainer) {
        cardsContainer.innerHTML = '';
        members.forEach((member, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            const role = index === 0 ? 'مسئول هماهنگی سفر' : 'عضو گروه';
            card.innerHTML = `
                <h3>${member}</h3>
                <p>${role}</p>
            `;
            cardsContainer.appendChild(card);
        });
    }

   
    if (countText) {
        countText.innerText = `در این سفر ${members.length} نفر حضور دارند.`;
    }

    if (memberList) {
        memberList.innerHTML = '';
        members.forEach((member, index) => {
            const li = document.createElement('li');
            li.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 10px; background: rgba(255,255,255,0.08); margin-bottom: 8px; border-radius: 8px; color: white;';
            li.innerHTML = `
                <span>${member}</span> 
                <button onclick="removeMember(${index})" style="background: #ef4444; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer;">حذف</button>
            `;
            memberList.appendChild(li);
        });
    }
}

function handleAddMember() {
    const input = document.getElementById('member-input');
    if (input && input.value.trim() !== '') {
        members.push(input.value.trim());
        saveData();
        renderMembers();
        input.value = '';
    }
}

function removeMember(index) {
    members.splice(index, 1);
    saveData();
    renderMembers();
}


function renderItems() {
    const itemList = document.getElementById('item-list');
    const stats = document.getElementById('item-stats');
    if (!itemList) return;

    itemList.innerHTML = '';
    let readyCount = 0;

    items.forEach((item, index) => {
        if (item.ready) readyCount++;
        
        const li = document.createElement('li');
        li.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 10px; background: rgba(255,255,255,0.08); margin-bottom: 8px; border-radius: 8px; color: white;';
        li.innerHTML = `
            <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                <input type="checkbox" ${item.ready ? 'checked' : ''} onchange="toggleItem(${index})">
                <span style="${item.ready ? 'text-decoration: line-through; opacity: 0.6;' : ''}">${item.name}</span>
            </label>
            <button onclick="removeItem(${index})" style="background: #ef4444; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer;">حذف</button>
        `;
        itemList.appendChild(li);
    });

    const total = items.length;
    const percentage = total > 0 ? Math.round((readyCount / total) * 100) : 0;
    
    if (stats) {
        stats.innerText = `وضعیت آمادگی: ${readyCount} از ${total} وسیله (${percentage}٪ آماده شده)`;
    }
}

function handleAddItem() {
    const input = document.getElementById('item-input');
    if (input && input.value.trim() !== '') {
        items.push({ name: input.value.trim(), ready: false });
        saveData();
        renderItems();
        input.value = '';
    }
}

function toggleItem(index) {
    items[index].ready = !items[index].ready;
    saveData();
    renderItems();
}

function removeItem(index) {
    items.splice(index, 1);
    saveData();
    renderItems();
}


function renderExpenses() {
    const expenseList = document.getElementById('expense-list');
    const cardsContainer = document.getElementById('expenses-cards-container');
    const totalElement = document.getElementById('total-expense');
    const perPersonElement = document.getElementById('per-person-expense');
    
    if (!expenseList && !cardsContainer) return;

    if (expenseList) expenseList.innerHTML = '';
    if (cardsContainer) cardsContainer.innerHTML = '';
    
    let totalSum = 0;

    expenses.forEach((exp, index) => {
        totalSum += Number(exp.amount);
        
        if (cardsContainer) {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h3>${exp.title}</h3>
                <p>${Number(exp.amount).toLocaleString()} تومان</p>
            `;
            cardsContainer.appendChild(card);
        }

        
        if (expenseList) {
            const li = document.createElement('li');
            li.style.cssText = 'padding: 12px; background: rgba(255,255,255,0.08); margin-bottom: 10px; border-radius: 10px; border-right: 4px solid #38bdf8; color: white;';
            li.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <strong>${exp.title} (${Number(exp.amount).toLocaleString()} تومان)</strong>
                    <button onclick="removeExpense(${index})" style="background: #ef4444; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer;">حذف</button>
                </div>
                <div style="font-size: 13px; color: #94a3b8; margin-top: 5px;">
                    پرداخت‌کننده: ${exp.payer || 'نامشخص'} | دسته‌بندی: ${exp.category || 'عمومی'}
                </div>
            `;
            expenseList.appendChild(li);
        }
    });

    if (totalElement) totalElement.innerText = `مجموع هزینه‌ها: ${totalSum.toLocaleString()} تومان`;
    if (perPersonElement) {
        const avg = members.length > 0 ? Math.round(totalSum / members.length) : 0;
        perPersonElement.innerText = `سهم متوسط هر نفر: ${avg.toLocaleString()} تومان`;
    }
}

function handleAddExpense() {
    const titleInput = document.getElementById('exp-title');
    const amountInput = document.getElementById('exp-amount');
    const categoryInput = document.getElementById('exp-category');
    const payerInput = document.getElementById('exp-payer');

    if (titleInput && amountInput && titleInput.value.trim() !== '' && Number(amountInput.value) > 0) {
        expenses.push({
            title: titleInput.value.trim(),
            amount: Number(amountInput.value),
            category: categoryInput ? categoryInput.value.trim() : 'عمومی',
            payer: payerInput ? payerInput.value.trim() : 'نامشخص'
        });

        saveData();
        renderExpenses();

        titleInput.value = '';
        amountInput.value = '';
        if (categoryInput) categoryInput.value = '';
        if (payerInput) payerInput.value = '';
    } else {
        alert('لطفاً عنوان و مبلغ هزینه را وارد کنید.');
    }
}

function removeExpense(index) {
    expenses.splice(index, 1);
    saveData();
    renderExpenses();
}

document.addEventListener('DOMContentLoaded', () => {
    renderMembers();
    renderItems();
    renderExpenses();
});

function renderItems() {
    const itemList = document.getElementById('item-list');
    const cardsContainer = document.getElementById('items-cards-container');
    const stats = document.getElementById('item-stats');
    
    if (!itemList && !cardsContainer) return;

    if (itemList) itemList.innerHTML = '';
    if (cardsContainer) cardsContainer.innerHTML = '';

    let readyCount = 0;

    items.forEach((item, index) => {
        if (item.ready) readyCount++;
        
        
        if (cardsContainer) {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h3>${item.name}</h3>
                <p>وضعیت: ${item.ready ? '✅ آماده شده' : '⏳ در حال آماده‌سازی'}</p>
            `;
            cardsContainer.appendChild(card);
        }

        
        if (itemList) {
            const li = document.createElement('li');
            li.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 12px; background: rgba(255,255,255,0.08); margin-bottom: 8px; border-radius: 8px; color: white;';
            li.innerHTML = `
                <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                    <input type="checkbox" ${item.ready ? 'checked' : ''} onchange="toggleItem(${index})">
                    <span style="${item.ready ? 'text-decoration: line-through; opacity: 0.6;' : ''}">${item.name}</span>
                </label>
                <button onclick="removeItem(${index})" style="background: #ef4444; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer;">حذف</button>
            `;
            itemList.appendChild(li);
        }
    });

    const total = items.length;
    const percentage = total > 0 ? Math.round((readyCount / total) * 100) : 0;
    
    if (stats) {
        stats.innerText = `وضعیت آمادگی: ${readyCount} از ${total} وسیله (${percentage}٪ آماده شده)`;
    }
}