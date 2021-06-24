// user.test.js

import React from "react";
import Detail from "../components/Detail";
import Enzyme, {mount} from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { shallow } from 'enzyme';


import axios from 'axios';
import MockAdapter from 'axios-mock-adapter'
import { act } from 'react-dom/test-utils';

Enzyme.configure({ adapter: new Adapter() });
/*test("dd", () => {
    const div = document.createElement("div");
    const renderizado = render(
        <Detail id="5"></Detail>,
        div
    )
    expect(renderizado.container).toBe("Something");
});*/
let wrapper;
beforeEach(() => {
//     const mock = new MockAdapter(axios);
//     let response = {
//         id: 5,
//         image: "https://cdn2.thedogapi.com/images/26pHT3Qk7.jpg",
//         name: "Akbash Dog",
//         temperament: "Loyal, Independent, Intelligent, Brave"
//         }
//   mock.onGet('http://localhost:3001/dogs/5').reply(200, response);
     wrapper = shallow(<Detail id="5"/>)
}) 
   
    it ("fff4322f", () => {
       
        
       /* wrapper.setProps({ dog: {
            id: 5,
            image: "https://cdn2.thedogapi.com/images/26pHT3Qk7.jpg",
            name: "Akbash Dog",
            temperament: "Loyal, Independent, Intelligent, Brave"
            } });*/
         // wrapper.find('h1').simulate('click'); // Simulating a click event.
         console.log(wrapper.debug())
         
         expect(wrapper).not.toBeNull();
      //    expect(wrapper.state('dog').name).toEqual('Akbash Dog');
        // let divdos = document.createElement("div");
        // document.body.appendChild(divdos);
    
    
        //      act(() => render(<Detail id="5" />, divdos))
        //      divdos.setProps();
        
        //   expect(divdos.querySelector("h1").textContent).toBe("dd");
    
    })



//it("renderiza datos del perro", async () => {
    /*const fakeDog = {
        name: "Samoyed",
        temperament: "Stubborn, Friendly, Sociable, Lively, Alert, Playful"
    };
   /* jest.spyOn(global, "fetch").mockImplementation(() =>
        Promise.resolve({
            json: () => Promise.resolve(fakeDog)
        })
    );*/

    // Usa la versión asíncrona de act para aplicar promesas resueltas
   /// await act(async () => {
     //   render(<Detail id="5" />, container);
   // });

   // expect(container.querySelector("h1").textContent).toBe('Akbash Dog');
    // expect(container.querySelector("strong").textContent).toBe(fakeUser.age);
    // expect(container.textContent).toContain(fakeUser.address);

    // elimina la simulación para asegurar que las pruebas estén completamente aisladas
   // global.fetch.mockRestore();
//    it("renderiza datos del perro", async () => {
//     wrapper.setProps({ dog: {
//         id: 5,
//         image: "https://cdn2.thedogapi.com/images/26pHT3Qk7.jpg",
//         name: "Akbash Dog",
//         temperament: "Loyal, Independent, Intelligent, Brave"
//         } });
//      // wrapper.find('h1').simulate('click'); // Simulating a click event.

//       expect(wrapper.state('dog').name).toEqual('Akbash Dog');

// });
  //  });