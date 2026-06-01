import { describe, expect, it } from 'vitest'
import { emptyRecipeForm, validateRecipeForm } from './recipeForm'

describe('validateRecipeForm', () => {
  it('requires title', () => {
    const errors = validateRecipeForm({ ...emptyRecipeForm(), title: '   ' })
    expect(errors.title).toBeDefined()
  })

  it('requires at least one ingredient and step', () => {
    const values = emptyRecipeForm()
    values.ingredients = ['  ']
    values.steps = ['']
    const errors = validateRecipeForm(values)
    expect(errors.ingredients).toBeDefined()
    expect(errors.steps).toBeDefined()
  })

  it('rejects invalid video url', () => {
    const values = emptyRecipeForm()
    values.title = 'Bolo'
    values.ingredients = ['farinha']
    values.steps = ['misturar']
    values.videoUrl = 'not-a-url'
    const errors = validateRecipeForm(values)
    expect(errors.videoUrl).toBeDefined()
  })

  it('accepts valid minimal form', () => {
    const values = emptyRecipeForm()
    values.title = 'Bolo'
    values.ingredients = ['farinha']
    values.steps = ['assar']
    expect(validateRecipeForm(values)).toEqual({})
  })
})
