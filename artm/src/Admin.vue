<template>

  <v-app>
    <v-toolbar app dark>
      <v-toolbar-title class="headline text-uppercase">
        <span>Artmoments Admin</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      Logged in:
      <v-chip>joel.arula@gmail.com</v-chip>
      <v-btn flat title="log out">
        <v-icon>logout</v-icon>
      </v-btn>
    </v-toolbar>

    <v-content>
      <v-toolbar flat >
       <v-text-field
          name="input"
          label="Painting Name"
        ></v-text-field>
      	<v-select
          :items="items"
          v-model="e1"
          label="Painting Category"
          single-line
        ></v-select>
        <v-select
          :items="items"
          v-model="e1"
          label="Painting Author"
          single-line
        ></v-select>
        <v-checkbox
        	hide-details
      		label="Published"
      		v-model="checkbox"
   		 ></v-checkbox>
      <v-spacer></v-spacer>
      	<v-btn flat round title="Add New">
        	Add New Painting<v-icon>add</v-icon>
     	 </v-btn>
      </v-toolbar>
      <v-data-table
    	:headers="headers"
    	:items="desserts"
    	class="elevation-1"
  		>
    		<template slot="items" slot-scope="props">

    		</template>
  		</v-data-table>
    </v-content>
  </v-app>
</template>

<script>

export default {
  name: 'Admin',
  data () {
    return {
      headers:[
    	  { text: 'Name', value: 'name' },
    	  { text: 'Category', value: 'category' },
    	  { text: 'Author', value: 'author' },
    	  { text: 'Preview', value: 'preview' },
      ]
    }
  }
}
</script>
