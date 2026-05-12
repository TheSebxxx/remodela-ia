const { supabase } = require('../lib/supabaseClient');

const Material = {
    findAll: async (filtros = {}) => {
        const { categoria, precioMin, precioMax, busqueda } = filtros;
        
        let query = supabase
            .from('catalogo_materiales')
            .select('*')
            .eq('activo', true); // Solo materiales activos

        if (categoria) {
            query = query.eq('categoria', categoria);
        }

        if (precioMin) {
            query = query.gte('precio_unitario', parseFloat(precioMin));
        }

        if (precioMax) {
            query = query.lte('precio_unitario', parseFloat(precioMax));
        }

        if (busqueda) {
            query = query.ilike('nombre', `%${busqueda}%`);
        }

        const { data, error } = await query.order('nombre', { ascending: true });
        
        if (error) throw error;
        return data;
    }
};

module.exports = Material;