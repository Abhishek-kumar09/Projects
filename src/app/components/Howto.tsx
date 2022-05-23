import React from 'react';
import MarkdownPreview from '@uiw/react-markdown-preview';

const source = `
# How to Use 

**1. Setup**
   - **Install Jest/Enzyme** for your project <br/>
      ${`npm install jest enzyme enzyme-adapter-react-16 @babel/core @babel/preset-env`}
   - Add **presets** to your .babelrc file <br/>
      { "presets": ["@babel/preset-env", "@babel/preset-react"] } 
   - Must have **React DevTools** extenion installed
   - Must be in developer mode (no minification or uglification)
   
**2. Select Unit Tests**
   - Select the components you want to test
   - Edit import statements as needed

**3. Export to Project Files**
   - Copy/Pase or Expot the Jest test file into your Project Directory

## Additional Information
Made with Love by the team at MAIT-CSE 2022
- Abhishek Kumar
- Hridam Nagar
- Harshit Dandriyal
        `;

function Howto() {
	return (
		<div>
			<MarkdownPreview source={source} />
		</div>
	);
}

export default Howto;
