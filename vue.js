export default {
    data() {
        return {
            jsonData: [],
        };
    },
    mounted() {
        this.fetchData();
    },
    methods: {
        async fetchData() {
            try {
                const response = await fetch('cards.json');
                this.jsonData = await response.json();
            }catch (error) {
                console.log('データの取得に失敗しました。', error);
            }
        }
    }
}