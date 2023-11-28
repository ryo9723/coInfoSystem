function isJpName(name) {
    const jp = /[\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}\p{Number}ーa-zA-Zａ-ｚＡ-Ｚ々〆〤]/gu;
    return jp.test(name);
}

function isCoName(company) {
    return company.includes('会社');
}

function isDivName(division) {
    return division.includes('部');
}

const titles = ['主任', '部長', '係長', '課長', ''];

const app = Vue.createApp({
    data() {
        return {
            data: [],
            sortBy: '',
            sortDirection: 'asc',
            newCoData: {
                name: '',
                company: '',
                division: '',
                title: ''
            }
        };
    },
    computed: {
        sortedData() {
            let sortData = this.data;
            if(this.sortBy) {
                sortData.sort((a, b) => {
                    const aValue = a[this.sortBy];
                    const bValue = b[this.sortBy];
                    if(this.sortBy === 'id') {
                        return this.sortDirection === 'asc'
                            ? aValue - bValue
                            : bValue - aValue;
                    }
                    return this.sortDirection === 'asc'
                        ? aValue.localeCompare(bValue)
                        : bValue.localeCompare(aValue);
                });
            }
            return sortData;
        }
    },
    methods: {
        sortTable(column) {
            if (this.sortBy === column) {
                this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                this.sortBy = column;
                this.sortDirection = 'asc';
            }
        },
        addNewEntry() {
            if (!this.newEntry.name || !this.newEntry.company || !this.newEntry.division) {
                alert('未入力の項目があります。');
                return;
            }

            if (!isJapaneseName(this.newEntry.name)) {
                nameError.textContent = '名前は日本語のみ入力可能です。'
                return;
            }

            if (!isCompanyName(this.newEntry.company)) {
                companyError.textContent = '会社名には「会社」という文字を含めてください。'
                return;
            }

            if (!isDivisionName(this.newEntry.division)) {
                divisionError.textContent = '部署名には「部」を含めて入力してください。'
                return;
            }

            if (!allowedTitles.includes(this.newEntry.title)) {
                alert('正しい役職を入力してください。');
                return;
}

            const newId = this.generateNewId();

            const newEntry = {
                id: newId,
                name: this.newEntry.name,
                company: this.newEntry.company,
                division: this.newEntry.division,
                title: this.newEntry.title
            };

            this.data.push(newEntry);

            this.newEntry = {
                name: '',
                company: '',
                division: '',
                title: ''
            };
        },
        generateNewId() {
            const ids = this.data.map(entry => entry.id);
            return ids.length > 0 ? Math.max(...ids) + 1 : 1;
        }
    },
    created() {
        fetch('cards.json')
            .then(Response => Response.json())
            .then(jsonData => {
                this.data = jsonData;
            })
            .catch(error => console.error('エラーです', error));
    }
});
app.mount('#app');