class ApiQueryBuilder {
    constructor(baseUrl, table) {
        this.baseUrl = baseUrl;
        this.table = table;
        this.action = 'select'; // 'select', 'insert', 'update', 'delete'
        this.payload = null;
        this.filters = {};
        this.orderings = [];
        this._limit = null;
    }

    select(fields) { this.action = 'select'; return this; }
    insert(payload) { this.action = 'insert'; this.payload = payload; return this; }
    update(payload) { this.action = 'update'; this.payload = payload; return this; }
    delete() { this.action = 'delete'; return this; }

    eq(field, value) { this.filters[field] = value; return this; }
    order(field, { ascending }) { this.orderings.push({ field, ascending }); return this; }
    limit(n) { this._limit = n; return this; }

    async then(resolve, reject) {
        try {
            let endpoint = this.table;
            if (endpoint === 'sales_history') endpoint = 'sales';
            let url = `${this.baseUrl}/${endpoint}`;
            let method = 'GET';
            let body = null;
            let queryParams = new URLSearchParams();

            if (this.action === 'select') {
                method = 'GET';
                // Add filters to query
                for (const [key, value] of Object.entries(this.filters)) {
                    queryParams.append(key, value);
                }
                
                // Special case for auth
                if (this.table === 'users' && this.filters.username && this.filters.password) {
                    url = `${this.baseUrl}/auth/login`;
                    method = 'POST';
                    body = JSON.stringify({ username: this.filters.username, password: this.filters.password });
                    queryParams = new URLSearchParams();
                } else if (this.table === 'users' && this.filters.username && !this.filters.password && Object.keys(this.filters).length === 1) {
                    // check if exists, handled by GET /users or we just return an array filtering locally if simple GET
                    url = `${this.baseUrl}/users`;
                }

            } else if (this.action === 'insert') {
                method = 'POST';
                body = JSON.stringify(this.payload);
                if (this.table === 'users') {
                    // special case for users registration
                    url = `${this.baseUrl}/auth/register`;
                    body = JSON.stringify(Array.isArray(this.payload) ? this.payload[0] : this.payload);
                }
            } else if (this.action === 'update') {
                method = 'PUT';
                if (!this.filters.id) throw new Error("Update requires an 'id' filter");
                url = `${this.baseUrl}/${this.table}/${this.filters.id}`;
                body = JSON.stringify(this.payload);
                // add user_id filter if it exists in update payload? Wait, the API takes user_id in the body.
                // We add any other filters into body
                const bodyObj = JSON.parse(body);
                if (this.filters.user_id) bodyObj.user_id = this.filters.user_id;
                body = JSON.stringify(bodyObj);

            } else if (this.action === 'delete') {
                method = 'DELETE';
                if (!this.filters.id) throw new Error("Delete requires an 'id' filter");
                url = `${this.baseUrl}/${this.table}/${this.filters.id}`;
                if (this.filters.user_id) {
                    queryParams.append('user_id', this.filters.user_id);
                }
            }

            if (queryParams.toString()) {
                url += `?${queryParams.toString()}`;
            }

            const options = {
                method,
                headers: { 'Content-Type': 'application/json' },
            };
            if (body) options.body = body;

            const response = await fetch(url, options);
            const data = await response.json();

            if (!response.ok) {
                return resolve({ data: null, error: { message: data.error || 'API Error' } });
            }

            // Post-processing for select to handle filters that backend doesn't handle natively
            let resultData = data.data;
            if (this.action === 'select' && resultData && Array.isArray(resultData)) {
                // If it wasn't the auth login, apply filters locally for any that the API didn't handle
                if (!(this.table === 'users' && this.filters.username && this.filters.password)) {
                    for (const [key, value] of Object.entries(this.filters)) {
                         resultData = resultData.filter(item => item[key] == value); // loose equality for string/int
                    }
                }
                
                // sort if needed (though backend handles some sorting, local sort is safe)
                if (this.orderings.length > 0) {
                    const { field, ascending } = this.orderings[0];
                    resultData.sort((a, b) => {
                        if (a[field] < b[field]) return ascending ? -1 : 1;
                        if (a[field] > b[field]) return ascending ? 1 : -1;
                        return 0;
                    });
                }

                if (this._limit !== null) {
                    resultData = resultData.slice(0, this._limit);
                }
            }

            return resolve({ data: resultData || [], error: null });

        } catch (err) {
            return resolve({ data: null, error: { message: err.message } });
        }
    }
}

function createApiClient(baseUrl) {
    return {
        from: (table) => new ApiQueryBuilder(baseUrl, table)
    };
}
