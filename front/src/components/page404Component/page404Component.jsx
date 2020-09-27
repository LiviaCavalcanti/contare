import React, { Component } from 'react';
import './page404Component.css'
class Page404Component extends Component {
  
  render() {
    return (
      <div>
        <h1>Oh oh...</h1>

<section class="error-container">
  <span class="four"><span class="screen-reader-text">4</span></span>
  <span class="zero"><span class="screen-reader-text">0</span></span>
  <span class="four"><span class="screen-reader-text">4</span></span>
</section>
<p class="zoom-area"> Infelizmente a página que você procura não pode ser encontrada. Ela pode estar temporariamente indisponível, ter sido movida ou não existir mais. </p>
<p class="zoom-area">Verifique se a URL que você procurou tem algum erro e tente novamente.</p>

      </div>
      
    );
  }
}

export default Page404Component;
