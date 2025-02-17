import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  searchQuery = ''; // Variable para almacenar la consulta de búsqueda

  // Método para manejar la búsqueda
  onSearch() {
    if (this.searchQuery.trim()) {
      console.log('Búsqueda:', this.searchQuery);
      // Aquí puedes redirigir a una página de resultados o realizar una petición HTTP
    } else {
      alert('Por favor, ingresa un término de búsqueda.');
    }
  }

  // Método para manejar el inicio de sesión
  onLogin() {
    console.log('Iniciar sesión');
    // Aquí puedes abrir un modal o redirigir a una página de inicio de sesión
  }
}
